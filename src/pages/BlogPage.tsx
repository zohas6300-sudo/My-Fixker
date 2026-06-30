import React, { useState } from 'react';
import { BLOGS, BlogArticle } from '../data/constants';
import { BookOpen, User, Calendar, Clock, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function BlogPage() {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleReadArticle = (article: BlogArticle) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const categories = ['all', ...Array.from(new Set(BLOGS.map(b => b.category)))];

  const filteredBlogs = filterCategory === 'all' 
    ? BLOGS 
    : BLOGS.filter(b => b.category === filterCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col space-y-8 text-left animate-fade-in">
      
      {/* ARTICLE READER VIEW */}
      {selectedArticle ? (
        <article className="space-y-6 max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-blue-600 font-bold self-start focus:outline-hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Articles Listing</span>
          </button>

          {/* Featured Image */}
          <div className="h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-150 shadow-xs bg-slate-100">
            <img 
              src={selectedArticle.image} 
              alt={selectedArticle.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-extrabold uppercase border border-blue-100 w-fit block">
              {selectedArticle.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight leading-tight">
              {selectedArticle.title}
            </h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium pt-1 border-b border-slate-100 pb-4">
              <span className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>By {selectedArticle.author}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{selectedArticle.date}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{selectedArticle.readTime}</span>
              </span>
            </div>
          </div>

          {/* Full content body */}
          <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap space-y-4">
            {selectedArticle.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Author standard bio box */}
          <div className="bg-slate-50 border border-slate-150 p-6 rounded-2xl flex items-center space-x-4 mt-8">
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 text-sm block">{selectedArticle.author}</span>
              <span className="text-xs text-slate-400 block">Verified Technical Contributor at FixKer.pk</span>
            </div>
          </div>
        </article>
      ) : (
        /* ARTICLES LIST VIEW */
        <div className="space-y-12">
          
          {/* Header */}
          <section className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">FIXKER LEARNING HUB</span>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Home Maintenance Guides</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Expert tips, maintenance hacks, and guidelines prepared by Pakistan\'s certified technicians to keep your household running smoothly.
            </p>
          </section>

          {/* Horizontal Category selectors */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${filterCategory === cat ? 'bg-blue-600 border-blue-600 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {cat === 'all' ? 'All Guides' : cat}
              </button>
            ))}
          </div>

          {/* Blog Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div 
                key={blog.id}
                className="bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug line-clamp-2 hover:text-blue-650 cursor-pointer" onClick={() => handleReadArticle(blog)}>
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium flex items-center space-x-1.5">
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{blog.excerpt}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-50">
                  <button
                    onClick={() => handleReadArticle(blog)}
                    className="text-xs text-blue-600 font-bold hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Organic Schema SEO Highlight Card */}
          <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-150">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Structured JSON-LD Schema</span>
              <h4 className="font-extrabold text-slate-800 text-lg">Google News & Article Schema Ready</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                All articles include automatic JSON-LD markup to appear as rich snippets in Google searches, driving massive organic leads to professionals registered on FixKer.pk.
              </p>
            </div>
            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-600">{"\"@context\": \"https://schema.org\""}</span>
          </section>

        </div>
      )}

    </div>
  );
}
