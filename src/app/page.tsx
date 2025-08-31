"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Check,
  Zap,
  Shield,
  Users,
  Code,
  Globe,
  Layers,
  Star,
  Play,
  FileText,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description:
        "Send API requests with blazing speed and get instant responses with detailed analytics.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Testing",
      description:
        "Built-in authentication support with OAuth, JWT, and API key management.",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Code Generation",
      description:
        "Auto-generate code snippets in multiple programming languages for easy integration.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Environment Management",
      description:
        "Manage multiple environments and switch between them seamlessly during testing.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Organized Collections",
      description:
        "Keep your APIs organized with collections and folders for better project management.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description:
        "Share collections and work together with your team on API development and testing.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Senior Developer",
      company: "TechCorp",
      content:
        "PostKit has streamlined our API testing workflow. The interface is intuitive and the response times are incredibly fast.",
    },
    {
      name: "Mike Chen",
      role: "API Engineer",
      company: "DataFlow Inc",
      content:
        "The collection organization and environment management features have made our API development process so much more efficient.",
    },
    {
      name: "Emily Rodriguez",
      role: "Full Stack Developer",
      company: "WebSolutions",
      content:
        "Clean, powerful, and reliable. PostKit handles everything from simple GET requests to complex authentication flows.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PostKit</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/examples"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Examples
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <Badge variant="secondary" className="mx-auto">
            <Play className="w-3 h-3 mr-1" />
            Ready to Use
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            The Modern API Testing Platform
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Build, test, and debug your APIs with ease. PostKit provides all the
            tools you need to create robust API integrations and ensure your
            endpoints work flawlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/auth/register">
                Start Testing APIs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              asChild
            >
              <Link href="/demo">
                <Play className="w-5 h-5 mr-2" />
                Try Demo
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              No setup required
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Works in browser
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Real-time testing
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything you need for API testing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful tools designed to make API development and testing simple,
            fast, and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">How it Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple, powerful workflow
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started with API testing in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Create Collections</h3>
              <p className="text-muted-foreground">
                Organize your APIs into collections and folders for better
                management and team collaboration.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Configure Requests</h3>
              <p className="text-muted-foreground">
                Set up your API requests with headers, parameters, body data,
                and authentication methods.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Test & Debug</h3>
              <p className="text-muted-foreground">
                Send requests, analyze responses, and debug your APIs with
                detailed insights and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary">Testimonials</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Trusted by developers worldwide
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what developers are saying about their experience with PostKit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &quot;{testimonial.content}&quot;
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to streamline your API testing?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust PostKit for their API
              testing needs. Start building better APIs today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8"
                asChild
              >
                <Link href="/auth/register">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/docs">
                  <FileText className="w-5 h-5 mr-2" />
                  View Documentation
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PostKit. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
