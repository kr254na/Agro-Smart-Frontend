import { useState } from 'react';
import {
  MessageSquare, Search, Plus, ThumbsUp, MessageCircle, Share2,
  Flag, Filter, TrendingUp, Sprout, Wheat, Droplets, Tag
} from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Separator } from '@/app/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export default function Community() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPost, setNewPost] = useState({ title: '', category: 'general', content: '' });

  const categories = [
    { id: 'all', name: 'All Topics', icon: MessageSquare, color: 'text-gray-400', count: 247 },
    { id: 'wheat', name: 'Wheat Farming', icon: Wheat, color: 'text-yellow-400', count: 52 },
    { id: 'rice', name: 'Rice Cultivation', icon: Sprout, color: 'text-green-400', count: 48 },
    { id: 'irrigation', name: 'Irrigation & Water', icon: Droplets, color: 'text-blue-400', count: 35 },
    { id: 'general', name: 'General Farming', icon: Tag, color: 'text-purple-400', count: 67 },
    { id: 'tools', name: 'Tools & Machinery', icon: TrendingUp, color: 'text-orange-400', count: 45 },
  ];

  const posts = [
    {
      id: 1,
      author: 'Rajesh Kumar',
      avatar: 'RK',
      farm: 'Awadh Sona Farm, Lucknow',
      title: 'Best organic fertilizers for Sharbati wheat?',
      content: 'I\'m looking for recommendations on organic fertilizers for the Lucknow region. Has anyone tried the local vermicompost from the Unnao mandi?',
      category: 'wheat',
      likes: 24,
      comments: 12,
      timestamp: '2 hours ago',
      tags: ['organic', 'fertilizer', 'lucknow', 'wheat'],
      isLiked: false
    },
    {
      id: 2,
      author: 'Priya Sharma',
      avatar: 'PS',
      farm: 'Gomti Organic Fields',
      title: 'Dealing with whiteflies on vegetables naturally',
      content: 'Any effective natural methods for pest control in Central UP? I want to avoid chemicals this monsoon season.',
      category: 'general',
      likes: 18,
      comments: 8,
      timestamp: '5 hours ago',
      tags: ['pest-control', 'organic', 'UP-farming'],
      isLiked: true
    },
    {
      id: 3,
      author: 'Arjun Singh',
      avatar: 'AS',
      farm: 'Golden Harvest (Barabanki)',
      title: 'Efficient drip irrigation for vegetable farms',
      content: 'I\'ve been using drip irrigation in my Barabanki farm. My water usage dropped by 40% compared to traditional flood methods...',
      category: 'irrigation',
      likes: 42,
      comments: 15,
      timestamp: '1 day ago',
      tags: ['water', 'barabanki', 'drip-irrigation'],
      isLiked: false
    },
    {
      id: 4,
      author: 'Neha Verma',
      avatar: 'NV',
      farm: 'Lakhnawi Harvest',
      title: 'Rice paddy transplantation - best timing for Lucknow?',
      content: 'Looking for advice on the optimal timing for rice transplantation in the Mohanlalganj block. Is next week good?',
      category: 'rice',
      likes: 15,
      comments: 6,
      timestamp: '2 days ago',
      tags: ['rice', 'lucknow', 'tips'],
      isLiked: false
    },
    {
      id: 5,
      author: 'Sanjay Yadav',
      avatar: 'SY',
      farm: 'Prayagraj Khet',
      title: 'Tractor service centers near Prayagraj',
      content: 'Can anyone recommend a reliable service center for Mahindra tractors in or near the Phulpur area?',
      category: 'tools',
      likes: 31,
      comments: 19,
      timestamp: '3 days ago',
      tags: ['tractor', 'prayagraj', 'equipment'],
      isLiked: false
    },
  ];

  const trendingTopics = [
    { name: 'Organic Farming', posts: 34, trend: '+12%' },
    { name: 'Water Management', posts: 28, trend: '+8%' },
    { name: 'Crop Rotation', posts: 22, trend: '+15%' },
    { name: 'Soil Health', posts: 19, trend: '+5%' },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/" className="text-gray-400 hover:text-green-400 transition-colors">
              Dashboard
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-green-400">Community</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Community</h1>
              <p className="text-gray-400 text-lg">Connect with other farmers, share tips, and ask questions</p>
            </div>
            
            {/* New Post Button */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2 justify-center lg:justify-start">
                  <Plus className="w-5 h-5" />
                  New Post
                </button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Create New Post</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Share your knowledge or ask a question to the community
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Title</label>
                    <Input
                      placeholder="e.g., Best practices for wheat irrigation"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Category</label>
                    <Select 
                      value={newPost.category} 
                      onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="general">General Farming</SelectItem>
                        <SelectItem value="wheat">Wheat Farming</SelectItem>
                        <SelectItem value="rice">Rice Cultivation</SelectItem>
                        <SelectItem value="irrigation">Irrigation & Water</SelectItem>
                        <SelectItem value="tools">Tools & Machinery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Content</label>
                    <Textarea
                      placeholder="Share your thoughts, questions, or experiences..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        alert('Your post has been submitted to the community!');
                        setNewPost({ title: '', category: 'general', content: '' });
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
                    >
                      Post to Community
                    </button>
                    <DialogTrigger asChild>
                      <button className="px-4 py-3 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-all">
                        Cancel
                      </button>
                    </DialogTrigger>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories & Trending */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-green-400" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                          : 'bg-gray-800/50 hover:bg-gray-800 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <category.icon className={`w-5 h-5 ${selectedCategory === category.id ? 'text-green-400' : category.color}`} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <Badge className={`text-xs ${
                        selectedCategory === category.id 
                          ? 'bg-green-500/30 text-green-400' 
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    Trending
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium text-sm">{topic.name}</p>
                        <p className="text-gray-400 text-xs">{topic.posts} posts</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        {topic.trend}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Posts Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search discussions, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {filteredPosts.map((post) => (
              <Card 
                key={post.id}
                className="bg-gray-900/50 border-gray-800 hover:border-green-500/30 transition-all cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 border-2 border-gray-700">
                      <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-600 text-white">
                        {post.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{post.author}</h3>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400 text-sm">{post.farm}</span>
                      </div>
                      <p className="text-gray-500 text-sm">{post.timestamp}</p>
                    </div>

                    <Badge className={`${
                      post.category === 'wheat' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                      post.category === 'rice' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                      post.category === 'irrigation' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                      post.category === 'tools' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                      'bg-purple-500/20 text-purple-400 border-purple-500/50'
                    }`}>
                      {categories.find(c => c.id === post.category)?.name}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                    <p className="text-gray-300 leading-relaxed">{post.content}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        className="bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer border-0"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="bg-gray-800" />

                  {/* Interaction Buttons */}
                  <div className="flex items-center gap-4">
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      post.isLiked 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                    }`}>
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-medium">{post.likes}</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-800 transition-all">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">{post.comments}</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-800 transition-all">
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </button>

                    <button className="ml-auto p-2 text-gray-500 hover:text-red-400 transition-colors">
                      <Flag className="w-5 h-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPosts.length === 0 && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="py-16 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all">
                        Start a Discussion
                      </button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
