"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Users,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  HandHeart,
  Shield,
  Zap,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">Unity</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="#how-it-works"
                className="text-white text-base hover:text-lg transform hover:scale-105 transition-all duration-200"
              >
                How It Works
              </Link>
              <Link
                href="#volunteers"
                className="text-white text-base hover:text-lg transform hover:scale-105 transition-all duration-200"
              >
                For Volunteers
              </Link>
              <Link
                href="#requesters"
                className="text-white text-base hover:text-lg transform hover:scale-105 transition-all duration-200"
              >
                Get Help
              </Link>
              <Button
                variant="default"
                className="bg-zinc-200 text-zinc-900 border-rose-200 hover:shadow-[0_0_16px_4px_#fecdd3] hover:bg-amber-50 transition-all duration-200"
                onClick={() => router.push("/signin")}
              >
                Sign In
              </Button>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              When Help is Needed, People{" "}
              <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-orange-600 bg-clip-text text-transparent">
                Unite
              </span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with local volunteers ready to help, or become a hero in
              your community. Together, we make a difference one act of kindness
              at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-full"
                onClick={() => router.push("/signup")}
              >
                Join Now
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                className="bg-white text-rose-600 border-rose-200 hover:bg-rose-50 px-8 py-4 text-lg rounded-full"
                onClick={() => router.push("/signup")}
              >
                Join as Organisation
                <HandHeart className="ml-2 h-5 w-5" />
              </Button> */}
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-rose-100 to-orange-100 rounded-3xl p-8 shadow-lg">
              <img
                src="/1.jpg"
                alt="People helping each other in community"
                className="w-full h-64 md:h-80 object-cover rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                How Unity Works
              </h2>
              <p className="text-xl text-white max-w-2xl mx-auto">
                Getting help or helping others is simple with our three-step
                process
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 border border-transparent hover:border-rose-600 hover:shadow-[0_0_20px_2px_#e11d48] rounded-2xl transform hover:scale-[1.015] transition-all duration-200">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-r from-rose-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HandHeart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    1. Request Help
                  </h3>
                  <p className="text-white leading-relaxed">
                    Post your request with details about what you need. Whether
                    it's groceries, transportation, or companionship, help is
                    just a tap away.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 border border-transparent hover:border-orange-700 hover:shadow-[0_0_20px_2px_#e11d48] rounded-2xl transform hover:scale-[1.015] transition-all duration-200">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-r from-rose-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    2. Get Matched
                  </h3>
                  <p className="text-white leading-relaxed">
                    Our smart matching system connects you with nearby
                    volunteers who have the skills and availability to help with
                    your specific needs.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 border border-transparent hover:border-orange-700 hover:shadow-[0_0_20px_2px_#e11d48] rounded-2xl transform hover:scale-[1.015] transition-all duration-200">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-r from-rose-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    3. Receive Support
                  </h3>
                  <p className="text-white leading-relaxed">
                    Connect with your volunteer hero, coordinate the help, and
                    experience the power of community support when you need it
                    most.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* For Volunteers Section */}
        <section
          id="volunteers"
          className="p-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Become a Community Hero
                </h2>
                <p className="text-xl text-white mb-8 leading-relaxed">
                  Join thousands of volunteers making a real difference in their
                  communities. Every act of kindness, no matter how small,
                  creates ripples of positive change.
                </p>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <Clock className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">
                        Flexible Scheduling
                      </h3>
                      <p className="text-white">
                        Help when it works for you. Set your availability and
                        choose requests that fit your schedule.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <Shield className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">
                        Safe & Verified
                      </h3>
                      <p className="text-white">
                        All users are verified for safety. Help with confidence
                        in a secure environment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <Zap className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">
                        Instant Impact
                      </h3>
                      <p className="text-white">
                        See the immediate difference you make in someone's life
                        and build lasting community connections.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-full"
                  onClick={() => router.push("/signup")}
                >
                  Be a Part of the Change
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <img
                  src="/2.jpg"
                  alt="Volunteers helping in community"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* For Requesters Section */}
        <section
          id="requesters"
          className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-8 rounded-3xl">
                <img
                  src="/3.jpg"
                  alt="Person receiving help from volunteer"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>

              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Get the Support You Need
                </h2>
                <p className="text-xl text-white mb-8 leading-relaxed">
                  Life can be challenging, but you don't have to face it alone.
                  Our community of caring volunteers is here to help when you
                  need it most.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-6 bg-rose-50 rounded-2xl">
                    <MapPin className="h-8 w-8 text-rose-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-grey-600 mb-2">
                      Local Support
                    </h3>
                    <p className="text-grey-600 text-sm">
                      Connect with helpers in your neighborhood
                    </p>
                  </div>

                  <div className="text-center p-6 bg-orange-50 rounded-2xl">
                    <Heart className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-grey-600 mb-2">
                      Caring Community
                    </h3>
                    <p className="text-grey-600 text-sm">
                      Genuine people who want to help
                    </p>
                  </div>
                </div>

                {/* <Button
                  size="lg"
                  variant="default"
                  className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-full"
                  onClick={() => router.push("/signup")}
                >
                  Start Your Journey
                  <HandHeart className="ml-2 h-5 w-5" />
                </Button> */}
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        {/* <section className="py-20 bg-gradient-to-r from-rose-500 to-orange-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Our Growing Impact</h2>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
              Together, we're building stronger communities one connection at a
              time
            </p>

            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-bold mb-2">1,247</div>
                <div className="opacity-90">Active Volunteers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3,892</div>
                <div className="opacity-90">People Helped</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">15,634</div>
                <div className="opacity-90">Acts of Kindness</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="opacity-90">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Testimonials Section */}
        {/* <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Stories from Our Community
              </h2>
              <p className="text-xl text-white max-w-2xl mx-auto">
                Real experiences from volunteers and those who've received help
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="p-8 border-0 shadow-lg rounded-2xl">
                <CardContent className="pt-0">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "When I couldn't get groceries after my surgery, Sarah from
                    Heroes Unite not only brought everything I needed but also
                    checked on me the next day. This app connected me with
                    genuine caring people."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      M
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Maria Rodriguez
                      </div>
                      <div className="text-gray-500 text-sm">
                        Help Recipient
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8 border-0 shadow-lg rounded-2xl">
                <CardContent className="pt-0">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "Volunteering through Heroes Unite has been incredibly
                    rewarding. I've helped with everything from moving furniture
                    to walking dogs, and every interaction reminds me why
                    community matters."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      D
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        David Chen
                      </div>
                      <div className="text-gray-500 text-sm">Volunteer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8 border-0 shadow-lg rounded-2xl">
                <CardContent className="pt-0">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "As a single mom, having volunteers help with childcare
                    during my job interviews was life-changing. Heroes Unite
                    didn't just connect me with help – it gave me hope and a new
                    job!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      A
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Amanda Johnson
                      </div>
                      <div className="text-gray-500 text-sm">
                        Help Recipient
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-rose-400 to-orange-400">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join our community today and be part of something bigger than
              yourself
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-full"
                onClick={() => router.push("/signup")}
              >
                Join Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                className="bg-white text-rose-600 border-rose-200 hover:bg-rose-50 px-8 py-4 text-lg rounded-full"
                onClick={() => router.push("/signup")}
              >
                Get Help Today
                <HandHeart className="ml-2 h-5 w-5" />
              </Button> */}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-2xl font-bold">Unity</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Connecting communities through acts of kindness and mutual
                  support.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Get Started</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Join as Volunteer
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Request Help
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Safety Guidelines
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Community Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Report Issue
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Connect</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Press
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Unity. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
