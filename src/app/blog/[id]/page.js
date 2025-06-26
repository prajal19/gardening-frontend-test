import React from 'react';
import Link from 'next/link';
import Container from '../../../components/ui/Container';
import PageHeader from '../../../components/layout/PageHeader';

// This would typically come from a database or API
const getArticleData = (id) => {
  const articles = {
    'seasonal-planting-guide': {
      title: 'Seasonal Planting Guide: What to Plant and When',
      excerpt: 'Learn the best times to plant various flowers, shrubs, and vegetables in your region for optimal growth and beauty throughout the year.',
      category: 'Gardening Tips',
      author: 'Sarah Williams',
      authorImage: '/images/team/sarah.jpg',
      authorBio: 'Lead Designer with over 10 years of experience in landscape architecture and horticulture.',
      date: 'May 15, 2023',
      image: '/images/blog/seasonal-planting.jpg',
      readTime: '8 min read',
      content: `
        <p>Timing is everything when it comes to successful gardening. Planting at the right time ensures your plants have the best chance to establish themselves and thrive. This guide will help you understand when to plant various types of plants for optimal growth in your garden.</p>
        
        <h2>Spring Planting (March-May)</h2>
        <p>Spring is the ideal time to plant many flowers and vegetables as the soil warms and the risk of frost decreases.</p>
        
        <h3>Early Spring</h3>
        <ul>
          <li><strong>Cool-season vegetables:</strong> Lettuce, spinach, peas, radishes, and carrots</li>
          <li><strong>Early-blooming perennials:</strong> Pansies, primroses, and dianthus</li>
          <li><strong>Spring bulbs:</strong> Dahlia, gladiolus, and lilies</li>
        </ul>
        
        <h3>Late Spring</h3>
        <ul>
          <li><strong>Warm-season vegetables:</strong> Tomatoes, peppers, cucumber, and squash (after last frost)</li>
          <li><strong>Tender annuals:</strong> Marigolds, petunias, and impatiens</li>
          <li><strong>Herbs:</strong> Basil, cilantro, and dill</li>
        </ul>
        
        <div class="tip-box">
          <h4>Pro Tip: Frost Dates</h4>
          <p>Always check your local last frost date before planting tender plants. Planting too early can result in frost damage or death of sensitive plants.</p>
        </div>
        
        <h2>Summer Planting (June-August)</h2>
        <p>Summer is ideal for heat-loving plants and planning for fall harvests.</p>
        
        <ul>
          <li><strong>Heat-tolerant vegetables:</strong> Okra, sweet potatoes, and southern peas</li>
          <li><strong>Fall vegetables:</strong> Brussels sprouts, kale, and broccoli (for fall harvest)</li>
          <li><strong>Summer-blooming perennials:</strong> Coneflowers, black-eyed Susans, and daylilies</li>
          <li><strong>Tropicals:</strong> Hibiscus, banana plants, and cannas</li>
        </ul>
        
        <h2>Fall Planting (September-November)</h2>
        <p>Fall is an excellent time for many perennials, trees, and shrubs, as the cooler temperatures reduce transplant shock while roots still have time to establish before winter.</p>
        
        <ul>
          <li><strong>Trees and shrubs:</strong> Most deciduous and evergreen varieties</li>
          <li><strong>Spring-blooming bulbs:</strong> Tulips, daffodils, crocuses, and hyacinths</li>
          <li><strong>Cool-season vegetables:</strong> Spinach, kale, and garlic</li>
          <li><strong>Perennials:</strong> Many native perennials establish well in fall</li>
        </ul>
        
        <div class="tip-box">
          <h4>Pro Tip: Fall Tree Planting</h4>
          <p>Trees planted in fall often outperform those planted in spring because they have time to establish roots before dealing with summer heat and drought.</p>
        </div>
        
        <h2>Winter Planting (December-February)</h2>
        <p>Winter is primarily a planning season in colder regions, but there are still some planting opportunities depending on your climate.</p>
        
        <ul>
          <li><strong>Bare-root plants:</strong> Fruit trees, roses, and some perennials</li>
          <li><strong>Indoor seed starting:</strong> Getting a jump on spring vegetables and flowers</li>
          <li><strong>Frost-hardy vegetables:</strong> In mild climates, plants like kale and spinach may be planted</li>
        </ul>
        
        <h2>Regional Considerations</h2>
        <p>The timing recommendations above are general guidelines. Your specific planting schedule should be adjusted based on your local climate zone. Southern regions may plant earlier in spring and later in fall than northern regions.</p>
        
        <h3>How to Determine Your Planting Calendar</h3>
        <ol>
          <li>Identify your USDA hardiness zone</li>
          <li>Research local frost dates (first and last)</li>
          <li>Consult your local extension office for region-specific recommendations</li>
          <li>Keep a garden journal to track successful planting times for future reference</li>
        </ol>
        
        <p>Remember that microclimates within your own yard can affect planting times as well. South-facing, protected areas may warm earlier in spring, while low spots may collect cold air and experience later frosts.</p>
        
        <p>By following a seasonal planting guide tailored to your region, you'll maximize your gardening success and enjoy a beautiful, productive landscape throughout the year.</p>
      `
    },
    'water-conservation-landscaping': {
      title: 'Water Conservation Techniques for Beautiful Landscapes',
      excerpt: 'Discover how to maintain a stunning landscape while minimizing water usage through smart plant selection, efficient irrigation, and sustainable practices.',
      category: 'Sustainability',
      author: 'Michael Johnson',
      authorImage: '/images/team/michael.jpg',
      authorBio: 'Founder & CEO with a passion for sustainable landscaping practices.',
      date: 'April 22, 2023',
      image: '/images/blog/water-conservation.jpg',
      readTime: '6 min read',
      content: `
        <p>Creating a beautiful landscape doesn't have to mean excessive water consumption. With thoughtful design, plant selection, and maintenance practices, you can have a stunning outdoor space that conserves water and remains resilient during dry periods.</p>
        
        <h2>Smart Plant Selection</h2>
        <p>The foundation of a water-efficient landscape starts with choosing the right plants.</p>
        
        <h3>Native Plants</h3>
        <p>Plants that are indigenous to your region have naturally adapted to local rainfall patterns and soil conditions. They typically require less supplemental water once established and provide valuable habitat for local wildlife.</p>
        
        <h3>Drought-Tolerant Species</h3>
        <p>Look for plants with adaptations that help them survive with minimal water:</p>
        <ul>
          <li>Silver or gray foliage that reflects sunlight</li>
          <li>Succulent leaves that store water</li>
          <li>Deep root systems that can access moisture far below the surface</li>
          <li>Small, waxy, or fuzzy leaves that reduce water loss</li>
        </ul>
        
        <div class="tip-box">
          <h4>Plant Spotlight: Ornamental Grasses</h4>
          <p>Many ornamental grasses like Feather Reed Grass and Little Bluestem are not only drought-tolerant but also add movement, texture, and year-round interest to the landscape.</p>
        </div>
        
        <h2>Efficient Irrigation Systems</h2>
        <p>How you deliver water to your landscape can significantly impact conservation efforts.</p>
        
        <h3>Drip Irrigation</h3>
        <p>Drip irrigation systems deliver water directly to plant roots, minimizing evaporation and runoff. These systems use 30-50% less water than traditional sprinklers and can be customized to deliver the exact amount of water each plant needs.</p>
        
        <h3>Smart Controllers</h3>
        <p>Modern irrigation technology can dramatically improve efficiency:</p>
        <ul>
          <li>Weather-based controllers adjust watering schedules based on local conditions</li>
          <li>Soil moisture sensors prevent irrigation when the soil is already adequately moist</li>
          <li>Rain sensors automatically skip watering cycles during or after rainfall</li>
          <li>Flow sensors detect leaks and shut down systems to prevent water waste</li>
        </ul>
        
        <h2>Soil Improvement</h2>
        <p>Healthy soil is crucial for water conservation as it acts like a sponge, absorbing and storing moisture for plant use.</p>
        
        <h3>Adding Organic Matter</h3>
        <p>Incorporate compost or other organic matter into your soil to:</p>
        <ul>
          <li>Improve water retention in sandy soils</li>
          <li>Enhance drainage in clay soils</li>
          <li>Support beneficial soil microbes that help plants access water and nutrients</li>
        </ul>
        
        <h3>Mulching</h3>
        <p>Apply a 2-3 inch layer of mulch around plants to:</p>
        <ul>
          <li>Reduce evaporation from soil</li>
          <li>Suppress water-competing weeds</li>
          <li>Moderate soil temperature</li>
          <li>Prevent soil compaction and erosion</li>
        </ul>
        
        <div class="tip-box">
          <h4>Pro Tip: Mulch Materials</h4>
          <p>Organic mulches like shredded bark or compost have the added benefit of improving soil quality as they break down over time.</p>
        </div>
        
        <h2>Practical Design Strategies</h2>
        
        <h3>Hydrozoning</h3>
        <p>Group plants with similar water needs together to prevent overwatering some plants while trying to meet the needs of thirstier ones. This allows for more efficient irrigation zoning.</p>
        
        <h3>Reduced Lawn Areas</h3>
        <p>Traditional lawns are typically the most water-intensive elements in a landscape. Consider:</p>
        <ul>
          <li>Replacing portions of lawn with drought-tolerant groundcovers</li>
          <li>Creating defined garden beds with water-efficient plants</li>
          <li>Installing hardscape features like patios or decorative gravel areas</li>
          <li>Using drought-tolerant grass varieties when lawn is desired</li>
        </ul>
        
        <h3>Rainwater Harvesting</h3>
        <p>Capture and store rainwater for use during dry periods:</p>
        <ul>
          <li>Rain barrels connected to downspouts</li>
          <li>Larger cistern systems for significant storage capacity</li>
          <li>Rain gardens that capture runoff and allow it to slowly infiltrate into the soil</li>
        </ul>
        
        <h2>Maintenance Practices</h2>
        <p>How you care for your landscape impacts its water requirements:</p>
        
        <h3>Proper Watering</h3>
        <ul>
          <li>Water deeply but infrequently to encourage deep root growth</li>
          <li>Water in the early morning to minimize evaporation</li>
          <li>Adjust irrigation schedules seasonally based on plant needs and weather</li>
        </ul>
        
        <h3>Regular Monitoring</h3>
        <ul>
          <li>Check irrigation systems for leaks, misaligned heads, or other inefficiencies</li>
          <li>Watch for signs of overwatering or underwatering in plants</li>
          <li>Use a soil moisture meter to make data-driven irrigation decisions</li>
        </ul>
        
        <p>By implementing these water conservation techniques, you can create and maintain a beautiful landscape that remains vibrant even during water restrictions while contributing to broader conservation efforts in your community.</p>
      `
    }
  };

  // Add more articles as needed, following the same structure

  return articles[id] || null;
};

export default function BlogArticlePage({ params }) {
  const article = getArticleData(params.id);
  
  if (!article) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Article Not Found</h1>
        <p className="text-gray-700 mb-8">The article you're looking for could not be found.</p>
        <Link href="/blog">
          <span className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors">
            Back to Blog
          </span>
        </Link>
      </Container>
    );
  }

  return (
    <>
      <PageHeader 
        title={article.title}
        description={article.excerpt}
        backgroundImage={article.image}
      />
      
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <div className="flex items-center space-x-4 mb-8">
            <img 
              src={article.authorImage} 
              alt={article.author}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{article.author}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{article.date}</span>
                <span className="mx-2">•</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
          
          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
          
          {/* Article Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-gray-700">Tags:</span>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                Landscaping
              </span>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                Tips
              </span>
            </div>
          </div>
          
          {/* Author Bio */}
          <div className="mt-12 bg-gray-50 rounded-lg p-8">
            <div className="flex items-start">
              <img 
                src={article.authorImage} 
                alt={article.author}
                className="w-16 h-16 rounded-full object-cover mr-6"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">About {article.author}</h3>
                <p className="text-gray-700">{article.authorBio}</p>
              </div>
            </div>
          </div>
          
          {/* Share Links */}
          <div className="mt-12 flex items-center">
            <span className="mr-4 text-gray-700">Share this article:</span>
            <div className="flex space-x-3">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-green-600 hover:text-green-800">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a href="#" className="text-blue-700 hover:text-blue-900">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Related Articles */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-green-800 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: 'hardscaping-101',
                  title: 'Hardscaping 101: Essential Elements for Your Outdoor Space',
                  image: '/images/blog/hardscaping-101.jpg',
                  date: 'March 10, 2023'
                },
                {
                  id: 'lawn-care-mistakes',
                  title: '5 Common Lawn Care Mistakes and How to Avoid Them',
                  image: '/images/blog/lawn-mistakes.jpg',
                  date: 'February 28, 2023'
                },
                {
                  id: 'garden-lighting-ideas',
                  title: 'Creative Garden Lighting Ideas to Enhance Your Outdoor Space',
                  image: '/images/blog/garden-lighting.jpg',
                  date: 'January 15, 2023'
                }
              ].map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/blog/${relatedArticle.id}`}>
                  <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={relatedArticle.image} 
                        alt={relatedArticle.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-2">{relatedArticle.date}</p>
                      <h3 className="text-lg font-semibold text-green-800 group-hover:text-green-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
} 