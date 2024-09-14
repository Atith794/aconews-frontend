import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from './components/NewsCard';
import Pagination from './components/Pagination';
import './App.css';

const App = () => {
  const [news, setNews] = useState([]);              
  const [query, setQuery] = useState('');            
  const [category, setCategory] = useState('');      
  const [country, setCountry] = useState('');        
  const [page, setPage] = useState(1);               
  const [totalPages, setTotalPages] = useState(1);   
  const [error, setError] = useState(null);          

  const fetchTopHeadlines = async () => {
    try {
      const response = await axios.get(`https://aconews-backend-ib0a.onrender.com/api/news/top-headlines`);
      setNews(response.data.articles);
      setTotalPages(Math.ceil(response.data.totalArticles / 10));
      setError(null);
    } catch (err) {
      console.error('Error fetching top headlines:', err);
      setError('Failed to load top headlines. Please try again later.');
    }
  };

  

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(`https://aconews-backend-ib0a.onrender.com/api/news`, {
        params: { query, category, country, page }
      });
      setNews(response.data.articles);
      setTotalPages(Math.ceil(response.data.totalArticles / 10));
      setError(null);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to load search results. Please try again later.');
    }
  };

  useEffect(() => {
    fetchTopHeadlines();
  }, [page]);

  const handleSearch = () => {
    if (query.trim()) {
      fetchSearchResults();
    } else {
      setError('Please enter a search term');
    }
  };

  return (
    <div className="App">
      <h1>ACONEWS</h1>
      <h3>Take a news break with a coffee</h3>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for news..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Filters for Category and Country */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="general">General</option>
        <option value="technology">Technology</option>
        <option value="business">Business</option>
        <option value="sports">Sports</option>
        {/* Add more categories as needed */}
      </select>

      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="">Select Country</option>
        <option value="us">United States</option>
        <option value="gb">United Kingdom</option>
        <option value="in">India</option>
        <option value="ca">Canada</option>
        {/* Add more countries as needed */}
      </select>

      {/* Search Button */}
      <button onClick={handleSearch}>Search</button>

      {/* Display Error Message */}
      {error && <div className="error">{error}</div>}

      {/* Display News Articles */}
      <div className="news-grid">
        {news.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>

      {/* Pagination Component */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage}/>
    </div>
  );
};

export default App;