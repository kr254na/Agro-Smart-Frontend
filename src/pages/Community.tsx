import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare, Search, Plus, ThumbsUp, MessageCircle, 
  Loader2, Send, AlertCircle, CloudAlert, 
  RefreshCcw, Tractor, ShoppingCart, Sprout, Trash2, Edit3, X, Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Separator } from '@/app/components/ui/separator';
import { apiClient } from '@/api/apiClient';
import { formatDistanceToNow } from 'date-fns';
import { getStorage } from '../utils/storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

// --- TYPES ---
type PostCategory = 
  | 'GENERAL_DISCUSSION' 
  | 'DISEASE_OUTBREAK' 
  | 'WEATHER_ALERT' 
  | 'SEED_EXCHANGE' 
  | 'EQUIPMENT_RENTAL' 
  | 'FERTILIZER_SALE' 
  | 'CROP_MARKET';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CommentResponse {
  id: number;
  content: string;
  authorName: string;
  authorEmail: string; 
  createdAt: string;
}

interface PostResponse {
  id: number;
  title: string;
  content: string;
  category: PostCategory;
  authorName: string;
  authorEmail: string; 
  createdAt: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  comments: CommentResponse[];
}

export default function Community() {
  // --- STATE ---
  const [currentUser, setCurrentUser] = useState<{email: string; name: string} | null>(null);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', category: 'GENERAL_DISCUSSION' as PostCategory, content: '' });
  
  const [selectedPostForComments, setSelectedPostForComments] = useState<PostResponse | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [activeCommentInput, setActiveCommentInput] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentValue, setEditCommentValue] = useState('');
  const [deleteConfig, setDeleteConfig] = useState<{ id: number; type: 'POST' | 'COMMENT'; postId?: number } | null>(null);

  const categoryConfig: Record<string, { name: string; icon: any; color: string }> = {
    ALL: { name: 'All Topics', icon: MessageSquare, color: 'text-slate-400' },
    GENERAL_DISCUSSION: { name: 'General', icon: MessageSquare, color: 'text-blue-400' },
    DISEASE_OUTBREAK: { name: 'Disease Alert', icon: AlertCircle, color: 'text-red-500' },
    WEATHER_ALERT: { name: 'Weather', icon: CloudAlert, color: 'text-amber-400' },
    SEED_EXCHANGE: { name: 'Seeds', icon: Sprout, color: 'text-green-400' },
    EQUIPMENT_RENTAL: { name: 'Rent Tools', icon: Tractor, color: 'text-purple-400' },
    FERTILIZER_SALE: { name: 'Fertilizer', icon: RefreshCcw, color: 'text-emerald-400' },
    CROP_MARKET: { name: 'Marketplace', icon: ShoppingCart, color: 'text-pink-400' },
  };

  // --- 1. LOAD IDENTITY (Merged Backend Profile + Frontend Email) ---
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiClient('/api/users/me') as Response;
        const result = await res.json();
        
        if (result.success) {
          // Get email from storage where you stored it during login
          const storedUser = getStorage('user_email'); 
          let emailFromStorage = '';

          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              emailFromStorage = parsed.email || parsed.username || '';
            } catch (e) {
              emailFromStorage = storedUser;
            }
          }

          setCurrentUser({
            name: `${result.data.firstName} ${result.data.lastName}`,
            email: emailFromStorage
          });
        }
      } catch (e) { 
        console.error("Identity fetch failed", e); 
      }
    };
    fetchMe();
  }, []);

  // --- 2. FETCH POSTS ---
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = (await apiClient(`/api/community/posts?${params.toString()}`)) as Response;
      const result = (await response.json()) as ApiResponse<PostResponse[]>;
      
      if (result.success) {
        setPosts(result.data);
        setSelectedPostForComments(current => {
          if (!current) return null;
          return result.data.find(p => p.id === current.id) || current;
        });
      }
    } catch (error) { 
      console.error("Fetch error:", error); 
    } finally { 
      setIsLoading(false); 
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPosts(), 300);
    return () => clearTimeout(timer);
  }, [fetchPosts]); 

  // --- 3. HELPERS ---
  const isOwner = (authorEmail: string) => {
    if (!currentUser?.email || !authorEmail) return false;
    return authorEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim();
  };

  // --- 4. ACTIONS ---
  const handleToggleLike = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const alreadyLiked = post.isLikedByCurrentUser;
    
    setPosts(prev => prev.map(p => p.id === postId ? {
        ...p,
        isLikedByCurrentUser: !alreadyLiked,
        likesCount: alreadyLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1
    } : p));

    try {
      await apiClient(`/api/community/posts/${postId}/like`, { method: 'POST' });
    } catch (e) { 
      fetchPosts(); 
    }
  };

  const handleCreatePost = async () => {
    try {
      const response = (await apiClient('/api/community/posts', {
        method: 'POST',
        body: JSON.stringify(newPost)
      })) as Response;
      if (response.ok) {
        setNewPost({ title: '', category: 'GENERAL_DISCUSSION', content: '' });
        setIsSubmitOpen(false);
        fetchPosts();
      }
    } catch (e) { console.error(e); }
  };

  const executeDelete = async () => {
    if (!deleteConfig) return;
    const { id, type, postId } = deleteConfig;
    try {
      const url = type === 'POST' ? `/api/community/posts/${id}` : `/api/community/comments/${id}`;
      const res = (await apiClient(url, { method: 'DELETE' })) as Response;
      if (res.ok) {
        if (type === 'POST') {
          setPosts(prev => prev.filter(p => p.id !== id));
          setIsCommentModalOpen(false);
        } else if (postId) {
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== id) } : p));
          setSelectedPostForComments(prev => prev ? { ...prev, comments: prev.comments.filter(c => c.id !== id) } : null);
        }
      }
    } catch (e) { console.error(e); }
    finally { setDeleteConfig(null); }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editCommentValue.trim()) return;
    try {
      const res = (await apiClient(`/api/community/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editCommentValue })
      })) as Response;
      const result = await res.json();
      if (result.success) {
        setPosts(prev => prev.map(p => ({
            ...p,
            comments: p.comments.map(c => c.id === commentId ? { ...c, content: editCommentValue } : c)
        })));
        setSelectedPostForComments(prev => prev ? {
          ...prev,
          comments: prev.comments.map(c => c.id === commentId ? { ...c, content: editCommentValue } : c)
        } : null);
        setEditingCommentId(null);
      }
    } catch (e) { console.error(e); }
  };

  const handleAddComment = async (postId: number) => {
    if (!activeCommentInput.trim()) return;
    try {
      const response = (await apiClient(`/api/community/comments/${postId}`, {
        method: 'POST',
        body: JSON.stringify({ content: activeCommentInput })
      })) as Response;
      const result = (await response.json()) as ApiResponse<CommentResponse>;
      if (result.success) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), result.data] } : p));
        setSelectedPostForComments(prev => prev ? { ...prev, comments: [...(prev.comments || []), result.data] } : null);
        setActiveCommentInput('');
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3 text-white">
              <MessageSquare className="text-[#48D87D]" /> Community Hub
            </h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">
                {currentUser ? `Welcome, ${currentUser.name}` : 'AgroSmart Lucknow'}
            </p>
          </div>
          <button onClick={() => setIsSubmitOpen(true)} className="px-6 py-3 bg-[#48D87D] text-black font-black uppercase text-xs tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(72,216,125,0.4)] transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Post
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#111] border-gray-800 shadow-2xl overflow-hidden">
              <CardHeader className="bg-black/40 border-b border-gray-800/50 pb-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white italic text-center">Topics</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-1.5">
                {Object.entries(categoryConfig).map(([id, config]) => (
                  <button key={id} onClick={() => setSelectedCategory(id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-[10px] font-black uppercase tracking-tighter ${selectedCategory === id ? 'bg-[#48D87D]/10 border border-[#48D87D]/30 text-[#48D87D]' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
                    <div className="flex items-center gap-2.5"><config.icon className="w-3.5 h-3.5" /> {config.name}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Feed */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[#48D87D] transition-colors" />
              <Input placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#111] border-gray-800 h-12 focus:border-[#48D87D] transition-all rounded-xl shadow-inner text-white" />
            </div>

            {isLoading ? (
              <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-[#48D87D] mx-auto" /></div>
            ) : posts.map((post) => (
              <Card key={post.id} className="bg-[#111] border-gray-800 hover:border-[#48D87D]/20 transition-all shadow-xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-gray-900 shadow-inner">
                        <AvatarFallback className="bg-gradient-to-br from-[#48D87D] to-emerald-600 text-black font-black uppercase">{post.authorName?.[0] || 'A'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-white font-black text-[11px] uppercase tracking-wide">{post.authorName}</h3>
                        <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest">{formatDistanceToNow(new Date(post.createdAt))} ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[8px] font-black uppercase bg-black/40 border-gray-800 ${categoryConfig[post.category]?.color}`}>
                        {categoryConfig[post.category]?.name}
                      </Badge>
                      {isOwner(post.authorEmail) && (
                        <button onClick={() => setDeleteConfig({ id: post.id, type: 'POST' })} className="text-gray-700 hover:text-red-500 transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h2 className="text-xl font-bold text-white tracking-tight italic uppercase">{post.title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-medium">{post.content}</p>
                  <Separator className="bg-gray-800/50" />
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all text-[10px] font-black uppercase ${post.isLikedByCurrentUser ? 'bg-[#48D87D] text-black shadow-[0_0_15px_rgba(72,216,125,0.4)]' : 'bg-black text-gray-500 hover:bg-gray-800 border border-gray-800'}`}>
                      <ThumbsUp className="w-3.5 h-3.5" /> {post.likesCount}
                    </button>
                    <button onClick={() => { setSelectedPostForComments(post); setIsCommentModalOpen(true); }}
                      className="flex items-center gap-2 px-5 py-2 bg-black text-gray-500 rounded-full hover:bg-gray-800 transition-all text-[10px] font-black uppercase border border-gray-800">
                      <MessageCircle className="w-3.5 h-3.5" /> {post.comments?.length || 0} Comments
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* --- CREATE POST MODAL --- */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="bg-black border-gray-800 text-white sm:max-w-[600px] !rounded-3xl shadow-2xl">
          <DialogHeader><DialogTitle className="uppercase font-black italic text-[#48D87D]">Create New Post</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4 text-white">
            <Input placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className="bg-[#111] border-gray-800 text-white" />
            <Select value={newPost.category} onValueChange={(val) => setNewPost({ ...newPost, category: val as PostCategory })}>
              <SelectTrigger className="bg-[#111] border-gray-800 uppercase text-[10px] font-black text-white"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent className="bg-[#111] border-gray-800 text-white">
                {Object.entries(categoryConfig).filter(([id]) => id !== 'ALL').map(([id, config]) => (
                  <SelectItem key={id} value={id} className="uppercase text-[10px] font-black">{config.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea placeholder="Post content..." value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} className="bg-[#111] border-gray-800 min-h-[150px] text-white" />
            <button onClick={handleCreatePost} className="w-full py-3 bg-[#48D87D] text-black font-black uppercase rounded-xl shadow-xl active:scale-95 transition-all">Submit</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- SCROLLABLE COMMENT MODAL --- */}
      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogContent className="bg-black border-gray-800 text-white sm:max-w-[700px] h-[85vh] max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl !rounded-3xl">
          {selectedPostForComments && (
            <div className="flex flex-col h-full w-full">
              <DialogHeader className="p-6 border-b border-gray-800 bg-[#111] shrink-0">
                <div className="flex items-center justify-between">
                  <Badge className={`w-fit text-[8px] font-black uppercase ${categoryConfig[selectedPostForComments.category]?.color}`}>
                      {categoryConfig[selectedPostForComments.category]?.name}
                  </Badge>
                  {isOwner(selectedPostForComments.authorEmail) && (
                    <button onClick={() => setDeleteConfig({ id: selectedPostForComments.id, type: 'POST' })} className="text-red-900 hover:text-red-500 flex items-center gap-1.5 transition-colors font-black uppercase text-[10px]">
                      <Trash2 size={12} /> Delete Post
                    </button>
                  )}
                </div>
                <DialogTitle className="text-2xl font-black italic tracking-tight uppercase text-white mt-2">{selectedPostForComments.title}</DialogTitle>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase mt-2">
                    <span className="text-[#48D87D]">{selectedPostForComments.authorName}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(selectedPostForComments.createdAt))} ago</span>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black custom-scrollbar">
                <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-[#48D87D] pl-4 italic bg-[#111] p-4 rounded-r-xl shadow-inner">
                  {selectedPostForComments.content}
                </p>
                <div className="space-y-4 pb-10">
                    {selectedPostForComments.comments?.map(comment => (
                      <div key={comment.id} className="bg-[#111] p-4 rounded-xl border border-gray-800 group relative shadow-inner">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#48D87D] text-[9px] font-black uppercase tracking-widest">{comment.authorName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-[8px] font-bold">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                            {isOwner(comment.authorEmail) && editingCommentId !== comment.id && (
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingCommentId(comment.id); setEditCommentValue(comment.content); }} className="text-gray-600 hover:text-[#48D87D] p-1"><Edit3 size={12} /></button>
                                <button onClick={() => setDeleteConfig({ id: comment.id, type: 'COMMENT', postId: selectedPostForComments.id })} className="text-gray-600 hover:text-red-500 p-1"><Trash2 size={12} /></button>
                              </div>
                            )}
                          </div>
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="flex gap-2">
                            <Input value={editCommentValue} onChange={(e) => setEditCommentValue(e.target.value)} className="bg-black border-gray-800 h-8 text-xs text-white" />
                            <button onClick={() => handleUpdateComment(comment.id)} className="bg-[#48D87D] text-black p-1 rounded-md px-2 font-bold text-xs">Save</button>
                            <button onClick={() => setEditingCommentId(null)} className="bg-gray-800 text-white p-1 rounded-md"><X size={14}/></button>
                          </div>
                        ) : (
                          <p className="text-gray-300 text-xs leading-relaxed font-medium">{comment.content}</p>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className="p-4 bg-[#111] border-t border-gray-800 shrink-0">
                <div className="flex gap-2 items-center bg-black p-2 rounded-xl border border-gray-800 focus-within:border-[#48D87D]/50 transition-all shadow-inner">
                    <Input placeholder="Add a comment..." value={activeCommentInput} onChange={(e) => setActiveCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(selectedPostForComments.id)}
                        className="bg-transparent border-none focus-visible:ring-0 text-sm h-9 text-white" />
                    <button onClick={() => handleAddComment(selectedPostForComments.id)} className="p-2 bg-[#48D87D] text-black rounded-lg hover:scale-105 transition-all"><Send size={16}/></button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRMATION --- */}
      <Dialog open={!!deleteConfig} onOpenChange={() => setDeleteConfig(null)}>
        <DialogContent className="bg-black border-2 border-red-900/50 text-white sm:max-w-[400px] !rounded-3xl shadow-2xl">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="text-red-500 w-6 h-6" />
            </div>
            <DialogTitle className="text-center text-xl font-black italic uppercase tracking-tighter text-white">Are you sure?</DialogTitle>
            <DialogDescription className="text-center text-gray-500 font-bold uppercase text-[10px] mt-2">
              This will be deleted forever.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <button onClick={executeDelete} className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs rounded-xl hover:bg-red-700 transition-all">Yes, Delete</button>
            <button onClick={() => setDeleteConfig(null)} className="w-full py-4 bg-gray-900 text-gray-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Cancel</button>
          </div>
        </DialogContent>
      </Dialog>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #48D87D; }
      `}</style>
    </div>
  );
}