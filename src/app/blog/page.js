import React from 'react';
import Link from 'next/link';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';

export default function BlogPage() {
  const articles = [
    {
      id: 'seasonal-planting-guide',
      title: 'Seasonal Planting Guide: What to Plant and When',
      excerpt: 'Learn the best times to plant various flowers, shrubs, and vegetables in your region for optimal growth and beauty throughout the year.',
      category: 'Gardening Tips',
      author: 'Sarah Williams',
      date: 'May 15, 2023',
      image: '/images/blog/seasonal-planting.jpg',
      readTime: '8 min read'
    },
    {
      id: 'water-conservation-landscaping',
      title: 'Water Conservation Techniques for Beautiful Landscapes',
      excerpt: 'Discover how to maintain a stunning landscape while minimizing water usage through smart plant selection, efficient irrigation, and sustainable practices.',
      category: 'Sustainability',
      author: 'Michael Johnson',
      date: 'April 22, 2023',
      image: '/images/blog/water-conservation.jpg',
      readTime: '6 min read'
    },
    {
      id: 'hardscaping-101',
      title: 'Hardscaping 101: Essential Elements for Your Outdoor Space',
      excerpt: 'An introduction to hardscaping elements that can transform your yard, including patios, walkways, retaining walls, and more.',
      category: 'Hardscaping',
      author: 'David Chen',
      date: 'March 10, 2023',
      image: '/images/blog/hardscaping-101.jpg',
      readTime: '10 min read'
    },
    {
      id: 'lawn-care-mistakes',
      title: '5 Common Lawn Care Mistakes and How to Avoid Them',
      excerpt: 'Learn about the most common mistakes homeowners make when caring for their lawns and expert tips to keep your grass lush and healthy.',
      category: 'Lawn Care',
      author: 'Lisa Rodriguez',
      date: 'February 28, 2023',
      image: '/images/blog/lawn-mistakes.jpg',
      readTime: '7 min read'
    },
    {
      id: 'garden-lighting-ideas',
      title: 'Creative Garden Lighting Ideas to Enhance Your Outdoor Space',
      excerpt: 'Explore innovative lighting techniques to highlight landscape features, improve safety, and create ambiance in your outdoor areas.',
      category: 'Outdoor Lighting',
      author: 'James Wilson',
      date: 'January 15, 2023',
      image: '/images/blog/garden-lighting.jpg',
      readTime: '6 min read'
    },
    {
      id: 'native-plants-benefits',
      title: 'The Benefits of Native Plants in Your Landscape Design',
      excerpt: 'Why incorporating native plants into your landscape design can improve sustainability, reduce maintenance, and support local wildlife.',
      category: 'Sustainability',
      author: 'Sarah Williams',
      date: 'December 5, 2022',
      image: '/images/blog/native-plants.jpg',
      readTime: '9 min read'
    },
    {
      id: 'fall-landscape-maintenance',
      title: 'Essential Fall Landscape Maintenance Checklist',
      excerpt: 'Prepare your landscape for winter with this comprehensive fall maintenance guide that ensures a beautiful yard come spring.',
      category: 'Seasonal Tips',
      author: 'Michael Johnson',
      date: 'October 10, 2022',
      image: '/images/blog/fall-maintenance.jpg',
      readTime: '8 min read'
    },
    {
      id: 'designing-outdoor-kitchen',
      title: 'Designing the Perfect Outdoor Kitchen for Your Lifestyle',
      excerpt: 'Key considerations and design ideas for creating a functional and beautiful outdoor kitchen that suits your entertaining needs.',
      category: 'Outdoor Living',
      author: 'David Chen',
      date: 'September 18, 2022',
      image: '/images/blog/outdoor-kitchen.jpg',
      readTime: '11 min read'
    },
    {
      id: 'drought-tolerant-landscaping',
      title: 'Drought-Tolerant Landscaping: Beauty Without the Water',
      excerpt: 'How to create stunning landscapes that thrive with minimal water through xeriscaping principles and smart plant selection.',
      category: 'Sustainability',
      author: 'Lisa Rodriguez',
      date: 'August 5, 2022',
      image: '/images/blog/drought-tolerant.jpg',
      readTime: '7 min read'
    }
  ];
  
  const categories = [
    'All Categories',
    'Gardening Tips',
    'Sustainability',
    'Hardscaping',
    'Lawn Care',
    'Outdoor Lighting',
    'Seasonal Tips',
    'Outdoor Living'
  ];

  return (
    <>
      <PageHeader 
        title="Landscaping Blog"
        description="Expert tips, ideas, and inspiration for your outdoor spaces"
        backgroundImage="/images/blog-header.jpg"
      />
      
      <Container className="py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Featured Article */}
            <div className="mb-12">
              <Link href={`/blog/${articles[0].id}`}>
                <div className="group bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="relative h-96 overflow-hidden">
                    <img 
                      src={articles[0].image} 
                      alt={articles[0].title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-semibold py-1 px-3 rounded-full">
                      Featured
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{articles[0].date}</span>
                      <span className="mx-2">•</span>
                      <span>{articles[0].readTime}</span>
                      <span className="mx-2">•</span>
                      <span>{articles[0].category}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-green-800 mb-3 group-hover:text-green-600 transition-colors">
                      {articles[0].title}
                    </h2>
                    <p className="text-gray-600 mb-4">{articles[0].excerpt}</p>
                    <div className="flex items-center">
                      <img 
                        src="/images/team/sarah.jpg" 
                        alt={articles[0].author}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <span className="font-medium">By {articles[0].author}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.slice(1).map((article) => (
                <Link key={article.id} href={`/blog/${article.id}`}>
                  <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span>{article.date}</span>
                        <span className="mx-2">•</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium bg-green-100 text-green-800 py-1 px-2 rounded">
                          {article.category}
                        </span>
                        <span className="text-green-600 text-sm font-medium">Read More →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex rounded-md shadow-sm">
                <button className="px-4 py-2 border border-gray-300 rounded-l-md bg-white text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 border-t border-b border-gray-300 bg-green-600 text-white">
                  1
                </button>
                <button className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Search Articles</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-2.5 text-gray-400 hover:text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <button className="text-gray-700 hover:text-green-600 hover:font-medium transition-colors">
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Popular Posts */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Popular Posts</h3>
              <div className="space-y-4">
                {articles.slice(0, 4).map((article) => (
                  <Link key={article.id} href={`/blog/${article.id}`}>
                    <div className="flex items-center group">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-16 h-16 rounded object-cover mr-3"
                      />
                      <div>
                        <h4 className="text-sm font-medium group-hover:text-green-600 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500">{article.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="bg-green-100 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-gray-700 mb-4">Get the latest landscaping tips and ideas delivered to your inbox monthly.</p>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
} 