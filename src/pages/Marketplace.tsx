import { useState } from 'react';
import { 
  Search, MapPin, Star, ShoppingCart, Plus, Edit, Trash2,
  Package, TrendingUp, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Premium Sharbati Wheat Seeds',
      category: 'Seeds',
      price: 450,
      unit: 'kg',
      seller: 'Awadh Agri solutions',
      location: 'Lucknow',
      rating: 4.8,
      reviews: 124,
      stock: 'In Stock',
      image: 'https://images.unsplash.com/photo-1762363147271-40c0c127fa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBzZWVkcyUyMGZhcm1pbmclMjBwcm9kdWN0c3xlbnwxfHx8fDE3Njk5MjE1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: true
    },
    {
      id: 2,
      name: 'Neem-Based Organic Fertilizer',
      category: 'Fertilizers',
      price: 850,
      unit: 'bag (25kg)',
      seller: 'Gomti Organic Biotech',
      location: 'Unnao',
      rating: 4.6,
      reviews: 98,
      stock: 'In Stock',
      image: 'https://images.unsplash.com/photo-1664129092848-73287f92dabe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmVydGlsaXplciUyMHNvaWwlMjBudXRyaWVudHN8ZW58MXx8fHwxNzY5OTIxNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: true
    },
    {
      id: 3,
      name: 'Advanced Drip Irrigation Kit',
      category: 'Tools',
      price: 3200,
      unit: 'set',
      seller: 'Lakhnawi Tools & Tech',
      location: 'Lucknow',
      rating: 4.9,
      reviews: 156,
      stock: 'In Stock',
      image: 'https://images.unsplash.com/photo-1727036195427-5250f60b9f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaW5nJTIwdG9vbHMlMjBlcXVpcG1lbnQlMjBtYWNoaW5lcnl8ZW58MXx8fHwxNzY5OTIxNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    },
    {
      id: 4,
      name: 'Dussheri Mangoes (Pre-Order)',
      category: 'Crops',
      price: 120,
      unit: 'kg',
      seller: 'Malihabad Orchards',
      location: 'Lucknow',
      rating: 4.7,
      reviews: 67,
      stock: 'Limited',
      image: 'https://images.unsplash.com/photo-1744659750204-87034350eec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwcHJvZHVjZXxlbnwxfHx8fDE3Njk5MjE1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    },
    {
      id: 5,
      name: 'Hybrid Rice Seeds - Paddy',
      category: 'Seeds',
      price: 580,
      unit: 'kg',
      seller: 'Prayagraj Seed agency',
      location: 'Prayagraj',
      rating: 4.5,
      reviews: 89,
      stock: 'In Stock',
      image: 'https://images.unsplash.com/photo-1762363147271-40c0c127fa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBzZWVkcyUyMGZhcm1pbmclMjBwcm9kdWN0c3xlbnwxfHx8fDE3Njk5MjE1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    },
    {
      id: 6,
      name: 'High Performance Power Tiller',
      category: 'Tools',
      price: 45000,
      unit: 'unit',
      seller: 'Kanpur Agri-Machinery',
      location: 'Kanpur',
      rating: 4.8,
      reviews: 112,
      stock: 'In Stock',
      image: 'https://images.unsplash.com/photo-1727036195427-5250f60b9f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaW5nJTIwdG9vbHMlMjBlcXVpcG1lbnQlMjBtYWNoaW5lcnl8ZW58MXx8fHwxNzY5OTIxNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    },
  ];

  const myProducts = [
    { id: 1, name: 'Suhag Wheat', price: 45, unit: 'kg', sold: 120, stock: 500 },
    { id: 2, name: 'Lucknowi Seasonal Veg', price: 30, unit: 'kg', sold: 85, stock: 200 },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || product.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
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
            <span className="text-green-400">Marketplace</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
              <p className="text-gray-400 text-lg">Buy or sell seeds, tools, fertilizers, and crops</p>
            </div>
            <button 
              onClick={() => alert('New listing feature coming soon!')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2 justify-center lg:justify-start"
            >
              <Plus className="w-5 h-5" />
              List New Product
            </button>
          </div>
        </div>

        {/* Tabs for Browse / My Listings */}
        <Tabs defaultValue="browse" className="mb-8">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="browse" className="data-[state=active]:bg-green-500/20 text-white data-[state=active]:text-green-400">
              Browse Products
            </TabsTrigger>
            <TabsTrigger value="mylisting" className="data-[state=active]:bg-green-500/20 text-white data-[state=active]:text-green-400">
              My Listings
            </TabsTrigger>
          </TabsList>

          {/* Browse Products Tab */}
          <TabsContent value="browse" className="mt-6">
            {/* Search and Filters */}
            <Card className="bg-gray-900/50 border-gray-800 mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search products or sellers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Seeds">Seeds</SelectItem>
                      <SelectItem value="Tools">Tools</SelectItem>
                      <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                      <SelectItem value="Crops">Crops</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Location Filter */}
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Lucknow">Lucknow</SelectItem>
                      <SelectItem value="Kanpur">Kanpur</SelectItem>
                      <SelectItem value="Barabanki">Barabanki</SelectItem>
                      <SelectItem value="Prayagraj">Prayagraj</SelectItem>
                      <SelectItem value="Unnao">Unnao</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Price Range Filter */}
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-500">₹0 - ₹500</SelectItem>
                      <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                      <SelectItem value="1000-3000">₹1,000 - ₹3,000</SelectItem>
                      <SelectItem value="3000+">₹3,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id}
                  className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all group hover:scale-105 cursor-pointer overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.featured && (
                      <Badge className="absolute top-3 right-3 bg-yellow-500/90 text-black border-0">
                        Featured
                      </Badge>
                    )}
                    <Badge className={`absolute top-3 left-3 ${
                      product.stock === 'In Stock' 
                        ? 'bg-green-500/90 text-white' 
                        : 'bg-orange-500/90 text-white'
                    } border-0`}>
                      {product.stock}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg text-white">{product.name}</CardTitle>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3" />
                      {product.location}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div>
                      <p className="text-3xl font-bold text-green-400">₹{product.price}</p>
                      <p className="text-sm text-gray-400">per {product.unit}</p>
                    </div>

                    <Separator className="bg-gray-800" />

                    {/* Seller Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Seller</p>
                        <p className="text-white font-medium">{product.seller}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold">{product.rating}</span>
                        <span className="text-gray-400 text-sm">({product.reviews})</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => alert(`Redirecting to checkout for ${product.name}...`)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Buy Now
                      </button>
                      <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            )}
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="mylisting" className="mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Listings</p>
                      <p className="text-4xl font-bold text-white mt-2">{myProducts.length}</p>
                    </div>
                    <Package className="w-12 h-12 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Sales</p>
                      <p className="text-4xl font-bold text-white mt-2">
                        {myProducts.reduce((acc, p) => acc + p.sold, 0)}
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Revenue</p>
                      <p className="text-4xl font-bold text-white mt-2">₹{
                        myProducts.reduce((acc, p) => acc + (p.sold * p.price), 0).toLocaleString()
                      }</p>
                    </div>
                    <ShoppingCart className="w-12 h-12 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Products Table */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Your Products</CardTitle>
                <CardDescription>Manage your listings and track sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myProducts.map((product, index) => (
                    <div 
                      key={product.id}
                      className={`flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all ${
                        index !== myProducts.length - 1 ? 'mb-4' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{product.name}</h4>
                          <p className="text-gray-400 text-sm">₹{product.price} per {product.unit}</p>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-gray-400 text-sm">Sold</p>
                          <p className="text-white font-semibold">{product.sold}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm">Stock</p>
                          <p className="text-white font-semibold">{product.stock}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm">Revenue</p>
                          <p className="text-green-400 font-semibold">
                            ₹{(product.sold * product.price).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
