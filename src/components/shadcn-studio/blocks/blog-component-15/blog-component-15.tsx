import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDaysIcon, ArrowRightIcon, SearchIcon } from 'lucide-react';

export type BlogPost = {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  date: string;
  category: string;
  author: string;
  authorLink: string;
  blogLink: string;
  categoryLink: string;
};

type BlogProps = {
  blogPosts: BlogPost[];
};

const BlogGrid = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <Card key={index} className="group h-full transition-all duration-300">
          <CardHeader>
            <a href={post.blogLink} className="overflow-hidden rounded-lg">
              <img
                src={post.imageUrl}
                alt={post.imageAlt}
                className="h-59.5 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="flex items-center justify-between gap-1.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <CalendarDaysIcon className="size-6" />
                <span className="text-base">{post.date}</span>
              </div>
              <a href={post.categoryLink}>
                <Badge className="bg-primary/10 text-primary h-auto border-0 text-sm">{post.category}</Badge>
              </a>
            </div>
            <h3 className="line-clamp-2 text-lg font-medium md:text-xl">
              <a href={post.blogLink}>{post.title}</a>
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-base">{post.description}</p>
            <div className="flex items-center justify-between">
              <a href={post.authorLink} className="text-sm font-medium">
                {post.author}
              </a>
              <Button
                size="icon"
                variant="outline"
                className="group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground dark:group-hover:bg-primary dark:hover:bg-primary"
                asChild
              >
                <a href={post.blogLink}>
                  <ArrowRightIcon className="size-4 -rotate-45" />
                  <span className="sr-only">Read more: {post.title}</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const Blog = ({ blogPosts }: BlogProps) => {
  const categories = ['All', 'Product', 'Design', 'Startup Growth'];

  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8">
        {/* Header */}
        <div className="space-y-4">
          <p className="text-sm">Blogs</p>

          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            Build Better Products with Insights & Inspiration.
          </h2>

          <p className="text-muted-foreground text-lg md:text-xl">
            Practical insights and real stories to guide your product from vision to reality.
          </p>
        </div>

        {/* Tabs and Search */}
        <Tabs defaultValue="All" className="gap-8 lg:gap-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <ScrollArea className="max-md:bg-muted w-full rounded-lg sm:w-auto">
              <TabsList className="gap-1 group-data-horizontal/tabs:h-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="not-data-active:hover:bg-primary/10 cursor-pointer px-3 text-base group-data-horizontal/tabs:after:h-0"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="relative max-md:w-full">
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                <SearchIcon className="size-4" />
                <span className="sr-only">Search</span>
              </div>
              <Input
                type="search"
                placeholder="Search"
                className="peer input-lg px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
              />
            </div>
          </div>

          {/* All Posts Tab */}
          <TabsContent value="All">
            <BlogGrid posts={blogPosts} />
          </TabsContent>

          {/* Category-specific Tabs */}
          {categories.slice(1).map((category, index) => (
            <TabsContent key={index} value={category}>
              <BlogGrid posts={blogPosts.filter((post) => post.category === category)} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Blog;
