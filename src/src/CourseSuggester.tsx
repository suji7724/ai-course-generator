import React, { useState } from 'react';
import { BookOpen, Sparkles, Search, ArrowRight, Youtube, AlertCircle } from 'lucide-react';
import axios from 'axios';
interface Course {
  title: string;
  channel: string;
  description: string;
  url: string;
  duration: string;
  level: string;
}
interface CourseSuggesterProps {
  'data-id'?: string;
  apiKey?: string;
}
const courseDatabase: Record<string, Course[]> = {
  programming: [{
    title: 'Python for Beginners - Full Course',
    channel: 'freeCodeCamp.org',
    description: 'Learn Python programming from scratch with hands-on projects',
    url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    duration: '4h 26m',
    level: 'Beginner'
  }, {
    title: 'JavaScript Full Course',
    channel: 'Bro Code',
    description: 'Complete JavaScript tutorial covering all fundamentals',
    url: 'https://www.youtube.com/watch?v=lfmg-EJ8gm4',
    duration: '8h 5m',
    level: 'Beginner'
  }, {
    title: "React Course - Beginner's Tutorial",
    channel: 'freeCodeCamp.org',
    description: 'Build modern web applications with React',
    url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    duration: '11h 55m',
    level: 'Intermediate'
  }, {
    title: 'Data Structures and Algorithms Full Course',
    channel: 'freeCodeCamp.org',
    description: 'Master DSA concepts with practical implementations',
    url: 'https://www.youtube.com/watch?v=8hly31xKli0',
    duration: '5h',
    level: 'Intermediate'
  }, {
    title: 'Data Structures Easy to Advanced Course',
    channel: 'freeCodeCamp.org',
    description: 'Complete guide to data structures from basics to advanced',
    url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM',
    duration: '9h 53m',
    level: 'Intermediate'
  }],
  design: [{
    title: 'Figma UI Design Tutorial',
    channel: 'DesignCourse',
    description: 'Master Figma for UI/UX design from basics to advanced',
    url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
    duration: '2h 15m',
    level: 'Beginner'
  }, {
    title: 'Adobe Illustrator Full Course',
    channel: 'Envato Tuts+',
    description: 'Complete guide to vector graphics and illustration',
    url: 'https://www.youtube.com/watch?v=Ib8UBwu3yGA',
    duration: '3h 30m',
    level: 'Beginner'
  }],
  business: [{
    title: 'Digital Marketing Full Course',
    channel: 'Simplilearn',
    description: 'Learn SEO, social media, email marketing and more',
    url: 'https://www.youtube.com/watch?v=nU-IIXBWlS4',
    duration: '11h',
    level: 'Beginner'
  }, {
    title: 'Business Strategy Course',
    channel: 'Corporate Finance Institute',
    description: 'Strategic planning and business development fundamentals',
    url: 'https://www.youtube.com/watch?v=8DJccJb5N_k',
    duration: '2h 45m',
    level: 'Intermediate'
  }],
  data: [{
    title: 'Data Analysis with Python',
    channel: 'freeCodeCamp.org',
    description: 'Learn data analysis using Python, NumPy, and Pandas',
    url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
    duration: '10h',
    level: 'Intermediate'
  }, {
    title: 'SQL Tutorial - Full Course',
    channel: 'freeCodeCamp.org',
    description: 'Complete SQL course for beginners',
    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    duration: '4h 20m',
    level: 'Beginner'
  }],
  general: [{
    title: "CS50's Introduction to Computer Science",
    channel: 'CS50',
    description: "Harvard's introduction to computer science",
    url: 'https://www.youtube.com/watch?v=8mAITcNt710',
    duration: '25h',
    level: 'Beginner'
  }, {
    title: 'Excel Full Course',
    channel: 'freeCodeCamp.org',
    description: 'Master Microsoft Excel from basics to advanced',
    url: 'https://www.youtube.com/watch?v=Vl0H-qTclOg',
    duration: '7h 5m',
    level: 'Beginner'
  }, {
    title: 'Photoshop Tutorial for Beginners',
    channel: 'Envato Tuts+',
    description: 'Complete Photoshop course covering all tools',
    url: 'https://www.youtube.com/watch?v=IyR_uYsRdPs',
    duration: '4h 30m',
    level: 'Beginner'
  }]
};
export function CourseSuggester({
  'data-id': dataId,
  apiKey
}: CourseSuggesterProps) {
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchYouTubeCourses = async (query: string): Promise<Course[]> => {
    if (!apiKey) {
      throw new Error('No API key provided');
    }
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: `${query} full course tutorial`,
          type: 'video',
          videoDuration: 'long',
          maxResults: 9,
          order: 'relevance',
          key: apiKey
        }
      });
      const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'contentDetails,snippet',
          id: response.data.items.map((item: any) => item.id.videoId).join(','),
          key: apiKey
        }
      });
      const courses: Course[] = detailsResponse.data.items.map((item: any) => {
        const duration = parseDuration(item.contentDetails.duration);
        const level = determineLevel(item.snippet.title, item.snippet.description);
        return {
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          description: item.snippet.description.slice(0, 150) + '...',
          url: `https://www.youtube.com/watch?v=${item.id}`,
          duration: duration,
          level: level
        };
      });
      return courses;
    } catch (err: any) {
      console.error('YouTube API Error:', err);
      throw new Error(err.response?.data?.error?.message || 'Failed to fetch courses from YouTube');
    }
  };
  const parseDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 'N/A';
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    if (hours) {
      return `${hours}h ${minutes || '0'}m`;
    }
    return `${minutes || '0'}m`;
  };
  const determineLevel = (title: string, description: string): string => {
    const text = (title + ' ' + description).toLowerCase();
    if (text.includes('beginner') || text.includes('introduction') || text.includes('basics')) {
      return 'Beginner';
    }
    if (text.includes('advanced') || text.includes('expert') || text.includes('master')) {
      return 'Advanced';
    }
    return 'Intermediate';
  };
  const analyzeInterest = async (interest: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      let matchedCourses: Course[] = [];
      if (apiKey) {
        // Use YouTube API if key is provided
        matchedCourses = await searchYouTubeCourses(interest);
      } else {
        // Fallback to local database
        await new Promise(resolve => setTimeout(resolve, 1500));
        const lowerInterest = interest.toLowerCase();
        if (lowerInterest.includes('data structure') || lowerInterest.includes('algorithm') || lowerInterest.includes('dsa') || lowerInterest.includes('leetcode')) {
          matchedCourses = courseDatabase.programming;
        } else if (lowerInterest.includes('program') || lowerInterest.includes('code') || lowerInterest.includes('coding') || lowerInterest.includes('software') || lowerInterest.includes('web') || lowerInterest.includes('javascript') || lowerInterest.includes('python') || lowerInterest.includes('react') || lowerInterest.includes('java') || lowerInterest.includes('c++') || lowerInterest.includes('development')) {
          matchedCourses = courseDatabase.programming;
        } else if (lowerInterest.includes('design') || lowerInterest.includes('ui') || lowerInterest.includes('ux') || lowerInterest.includes('graphic') || lowerInterest.includes('figma')) {
          matchedCourses = courseDatabase.design;
        } else if (lowerInterest.includes('business') || lowerInterest.includes('marketing') || lowerInterest.includes('entrepreneur')) {
          matchedCourses = courseDatabase.business;
        } else if (lowerInterest.includes('data science') || lowerInterest.includes('data analysis') || lowerInterest.includes('analytics') || lowerInterest.includes('sql') || lowerInterest.includes('machine learning') || lowerInterest.includes('ai')) {
          matchedCourses = courseDatabase.data;
        } else {
          matchedCourses = courseDatabase.general;
        }
      }
      setSuggestions(matchedCourses);
      setStep('results');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses. Please try again.');
      // Fallback to general courses on error
      setSuggestions(courseDatabase.general);
      setStep('results');
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      analyzeInterest(userInput);
    }
  };
  const handleSkip = () => {
    setSuggestions(courseDatabase.general);
    setStep('results');
  };
  const handleReset = () => {
    setStep('input');
    setUserInput('');
    setSuggestions([]);
  };
  return <div data-id={dataId} className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            AI Course Finder
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the best free YouTube courses tailored to your interests
          </p>
          {!apiKey && <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span>
                Using curated courses. Add API key for live YouTube search.
              </span>
            </div>}
        </div>
        {step === 'input' && <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  What would you like to learn?
                </h2>
              </div>
              <p className="text-gray-600 mb-8">
                Tell us about your interests, and our AI will recommend the
                perfect courses for you.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
                    Your interests
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="interest" type="text" value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="e.g., web development, graphic design, data science..." className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" disabled={!userInput.trim() || isAnalyzing} className="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                    {isAnalyzing ? <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {apiKey ? 'Searching YouTube...' : 'Analyzing...'}
                      </> : <>
                        Get Suggestions
                        <ArrowRight className="w-5 h-5" />
                      </>}
                  </button>
                  <button type="button" onClick={handleSkip} className="sm:flex-none bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Show Popular Courses
                  </button>
                </div>
              </form>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Not comfortable sharing? No problem! Click "Show Popular
                  Courses" to see our curated selection.
                </p>
              </div>
            </div>
          </div>}
        {step === 'results' && <div>
            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Error fetching courses
                  </p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Showing curated courses instead.
                  </p>
                </div>
              </div>}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Recommended Courses
                </h2>
                <p className="text-gray-600">
                  {userInput ? `Based on your interest in: ${userInput}` : 'Popular courses for you'}
                </p>
              </div>
              <button onClick={handleReset} className="bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md border border-gray-200">
                New Search
              </button>
            </div>
            {suggestions.length === 0 ? <div className="text-center py-12">
                <p className="text-gray-500">
                  No courses found. Try a different search term.
                </p>
              </div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((course, index) => <a key={index} href={course.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 group border border-gray-100 hover:border-indigo-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                        <Youtube className="w-6 h-6 text-red-600" />
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' : course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      by {course.channel}
                    </p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {course.duration}
                      </span>
                      <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>)}
              </div>}
          </div>}
      </div>
    </div>;
}