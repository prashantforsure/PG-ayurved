'use client'
import React from 'react';
import { YoutubeIcon, Phone, Mail, ExternalLink, Play } from 'lucide-react';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AboutPage = () => {
  const opts: YouTubeProps['opts'] = {
    height: '360',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  const videoId = 'IZFLAGxFIiE';

  const onReady = (event: YouTubeEvent) => {
    const player = event.target;

    console.log('YouTube Player is ready:', player);
  };

  const onError = (error: YouTubeEvent) => {
    console.error('YouTube Player Error:', error.data);
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-12">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                Welcome to Our Channel
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Join our community of learners and discover expert-led tutorials,
                in-depth courses, and valuable resources to accelerate your
                growth.
              </p>
              <div className="flex items-center space-x-2">
                <YoutubeIcon className="text-red-500" size={24} />
                <span className="text-gray-600">32K+ Subscribers</span>
                <span>
                  <Link href="https://www.youtube.com/@pgayurvedprayojanamonlineclass">
                  <Button
                  size="lg" 
                  variant="outline"
                  className="flex items-center"
                >
                  <Play className="ml-2 h-4 w-4" />
                  Watch Video
                </Button>
                  </Link>

                </span>
              </div>
            </div>
            <div className="aspect-video  overflow-hidden">
              <YouTube
                videoId={videoId}
                opts={opts}
                onReady={onReady}
                onError={onError}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Online Coaching
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">One-on-One Sessions</h3>
              <p className="text-gray-600">
                Personalized coaching tailored to your specific needs and goals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Group Classes</h3>
              <p className="text-gray-600">
                Learn together with peers in an interactive environment.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Video Courses</h3>
              <p className="text-gray-600">
                Self-paced learning with comprehensive video materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Download Our Mobile App
              </h2>
              <p className="text-gray-600 mb-6">
                Take your learning journey on the go with our mobile app. Access
                courses, track progress, and learn anywhere, anytime.
              </p>
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="mr-2" size={20} />
                Download from Play Store
              </a>
            </div>
            <div className="md:w-1/2">
              <img
                src="/api/placeholder/400/600"
                alt="Mobile App Preview"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Contact Us
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="text-blue-600" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold">Phone</h3>
                    <p className="text-gray-600">+1 (123) 456-7890</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="text-blue-600" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="text-gray-600">contact@example.com</p>
                    <p className="text-gray-600">support@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;