import React, { Component } from 'react';
import { CourseSuggester } from './src/CourseSuggester';
export function ComponentPreview() {
  // Set your YouTube API key here once
  // Get your API key from: https://console.cloud.google.com/apis/credentials
  const YOUR_API_KEY = 'AIzaSyAFfngwe9GRdN7cD3j5f-LsPb_-s6ByU8g';
  return <div className="w-full min-h-screen">
      <CourseSuggester apiKey={YOUR_API_KEY || undefined} />
    </div>;
}