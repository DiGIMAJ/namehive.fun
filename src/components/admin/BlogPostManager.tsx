
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Pencil, Plus, Trash2, Tag, Eye, Calendar, Bold, Italic, Heading, Link as LinkIcon, List, ListOrdered, Quote, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';
import slugify from 'slugify';

const defaultBlogPost: BlogPost = {
  id: '',
  title: '',
  excerpt: '',
  content: '',
  image: '/placeholder.svg',
  category: '',
  tags: [],
  author: '',
  date: new Date().toISOString(),
  meta_description: '',
  published: false,
  slug: ''
};

const BlogPostManager = () => {
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost>(defaultBlogPost);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewPost, setIsNewPost] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [editorTab, setEditorTab] = useState("write");
  const [selectedText, setSelectedText] = useState({start: 0, end: 0});

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase
        .from('blog_posts') as any)
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setIsNewPost(false);
    setOpenDialog(true);
  };

  const handleNewPost = () => {
    setCurrentPost({
      ...defaultBlogPost,
      date: new Date().toISOString(),
      author: 'Admin'
    });
    setIsNewPost(true);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title' && isNewPost) {
      // Generate slug from title for new posts
      const slug = slugify(value, { lower: true, strict: true });
      setCurrentPost(prev => ({ ...prev, [name]: value, slug }));
    } else {
      setCurrentPost(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagAdd = () => {
    if (!tagInput.trim()) return;
    
    setCurrentPost(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()]
    }));
    
    setTagInput('');
  };

  const handleTagRemove = (tagToRemove: string) => {
    setCurrentPost(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSave = async () => {
    try {
      if (!currentPost.title) {
        toast({
          title: "Error",
          description: "Title is required",
          variant: "destructive"
        });
        return;
      }
      
      // Generate a slug if not present
      let slug = currentPost.slug;
      if (!slug) {
        slug = slugify(currentPost.title, { lower: true, strict: true });
      }
      
      if (isNewPost) {
        const { error } = await (supabase
          .from('blog_posts') as any)
          .insert({
            title: currentPost.title,
            excerpt: currentPost.excerpt,
            content: currentPost.content,
            image: currentPost.image,
            category: currentPost.category,
            tags: currentPost.tags,
            author: currentPost.author,
            date: currentPost.date,
            meta_description: currentPost.meta_description,
            published: currentPost.published,
            slug: slug
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post created successfully"
        });
      } else {
        const { error } = await (supabase
          .from('blog_posts') as any)
          .update({
            title: currentPost.title,
            excerpt: currentPost.excerpt,
            content: currentPost.content,
            image: currentPost.image,
            category: currentPost.category,
            tags: currentPost.tags,
            author: currentPost.author,
            date: currentPost.date,
            meta_description: currentPost.meta_description,
            published: currentPost.published,
            slug: slug
          })
          .eq('id', currentPost.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post updated successfully"
        });
      }
      
      setOpenDialog(false);
      fetchBlogPosts();
      await supabase.functions.invoke('generate-sitemap');
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const { error } = await (supabase
        .from('blog_posts') as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });
      
      fetchBlogPosts();
      await supabase.functions.invoke('generate-sitemap');
      
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const { error } = await (supabase
        .from('blog_posts') as any)
        .update({ published: !post.published })
        .eq('id', post.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Blog post ${post.published ? 'unpublished' : 'published'} successfully`
      });
      
      fetchBlogPosts();
      
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        title: "Error",
        description: "Failed to update publish status",
        variant: "destructive"
      });
    }
  };

  const handleFormatting = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end && format !== 'heading' && format !== 'quote' && format !== 'ul' && format !== 'ol') {
      // No text selected for formatting that requires selection
      return;
    }
    
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    let newText = '';
    let cursorPosition;
    
    switch (format) {
      case 'bold':
        newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
        cursorPosition = end + 4;
        break;
      case 'italic':
        newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
        cursorPosition = end + 2;
        break;
      case 'heading':
        newText = text.substring(0, start) + `## ${selectedText}` + text.substring(end);
        cursorPosition = end + 3;
        break;
      case 'subheading':
        newText = text.substring(0, start) + `### ${selectedText}` + text.substring(end);
        cursorPosition = end + 4;
        break;
      case 'link':
        newText = text.substring(0, start) + `[${selectedText}](url)` + text.substring(end);
        cursorPosition = end + 7;
        break;
      case 'quote':
        newText = text.substring(0, start) + `> ${selectedText}` + text.substring(end);
        cursorPosition = end + 2;
        break;
      case 'ul':
        newText = text.substring(0, start) + `- ${selectedText}` + text.substring(end);
        cursorPosition = end + 2;
        break;
      case 'ol':
        newText = text.substring(0, start) + `1. ${selectedText}` + text.substring(end);
        cursorPosition = end + 3;
        break;
      case 'image':
        newText = text.substring(0, start) + `![${selectedText || 'Image description'}](${currentPost.image || 'image-url'})` + text.substring(end);
        cursorPosition = end + 5;
        break;
      default:
        return;
    }
    
    setCurrentPost(prev => ({
      ...prev,
      content: newText
    }));
    
    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button onClick={handleNewPost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading blog posts...</div>
      ) : (
        <div className="grid gap-4">
          {blogPosts.map(post => (
            <Card key={post.id} className={`border ${post.published ? 'border-green-200' : 'border-gray-200'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {post.date && format(new Date(post.date), 'MMM d, yyyy')}
                      {post.category && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{post.category}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => togglePublish(post)}
                      className={post.published ? "bg-green-50" : ""}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {post.published ? "Published" : "Draft"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {blogPosts.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No blog posts yet</p>
              <Button 
                variant="link" 
                onClick={handleNewPost} 
                className="mt-2"
              >
                Create your first post
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNewPost ? 'Create New Post' : 'Edit Post'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                <Input 
                  id="title" 
                  name="title" 
                  value={currentPost.title} 
                  onChange={handleInputChange} 
                  placeholder="Post title"
                />
              </div>
              
              <div className="col-span-2">
                <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Excerpt</label>
                <Textarea 
                  id="excerpt" 
                  name="excerpt" 
                  value={currentPost.excerpt} 
                  onChange={handleInputChange} 
                  placeholder="Short excerpt or summary"
                  rows={2}
                />
              </div>
              
              <div className="col-span-2">
                <label htmlFor="meta_description" className="block text-sm font-medium mb-1">Meta Description (SEO)</label>
                <Textarea 
                  id="meta_description" 
                  name="meta_description" 
                  value={currentPost.meta_description} 
                  onChange={handleInputChange} 
                  placeholder="Description for search engines"
                  rows={2}
                />
              </div>
              
              <div className="col-span-2">
                <Tabs value={editorTab} onValueChange={setEditorTab} className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="content" className="block text-sm font-medium">Content</label>
                    <div className="flex items-center">
                      <TabsList>
                        <TabsTrigger value="write">Write</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>
                    </div>
                  </div>
                  
                  <TabsContent value="write" className="mt-0">
                    <div className="bg-gray-100 p-1 rounded mb-2 flex gap-1 overflow-x-auto">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleFormatting('bold')}
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleFormatting('italic')}
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleFormatting('heading')}
                        title="Heading"
                      >
                        <Heading className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleFormatting('subheading')}
                        title="Subheading"
                      >
                        <Heading className="h-3 w-3" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleFormatting('link')}
                        title="Link"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleFormatting('quote')}
                        title="Quote"
                      >
                        <Quote className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleFormatting('ul')}
                        title="Bullet List"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleFormatting('ol')}
                        title="Numbered List"
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleFormatting('image')}
                        title="Image"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Textarea 
                      id="content" 
                      name="content" 
                      value={currentPost.content} 
                      onChange={handleInputChange} 
                      placeholder="Post content - use the formatting buttons above to add styling"
                      rows={15}
                      className="font-mono"
                    />
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-0 border rounded-md p-4 min-h-[400px] prose max-w-none">
                    {currentPost.content ? (
                      <div>
                        {currentPost.content.split('\n\n').map((paragraph, index) => {
                          if (paragraph.startsWith('## ')) {
                            return (
                              <h2 key={index} className="text-xl font-bold mt-8 mb-4">
                                {paragraph.replace('## ', '')}
                              </h2>
                            );
                          } else if (paragraph.startsWith('### ')) {
                            return (
                              <h3 key={index} className="text-lg font-bold mt-6 mb-3">
                                {paragraph.replace('### ', '')}
                              </h3>
                            );
                          } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return (
                              <p key={index} className="mb-4 font-bold">
                                {paragraph.replace(/^\*\*|\*\*$/g, '')}
                              </p>
                            );
                          } else if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                            return (
                              <p key={index} className="mb-4 italic">
                                {paragraph.replace(/^\*|\*$/g, '')}
                              </p>
                            );
                          } else if (paragraph.startsWith('> ')) {
                            return (
                              <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4">
                                {paragraph.replace('> ', '')}
                              </blockquote>
                            );
                          } else if (paragraph.startsWith('- ')) {
                            return (
                              <ul key={index} className="list-disc list-inside mb-4">
                                {paragraph.split('\n').map((item, idx) => (
                                  <li key={idx} className="mb-1">{item.replace('- ', '')}</li>
                                ))}
                              </ul>
                            );
                          } else if (/^\d+\.\s/.test(paragraph)) {
                            return (
                              <ol key={index} className="list-decimal list-inside mb-4">
                                {paragraph.split('\n').map((item, idx) => (
                                  <li key={idx} className="mb-1">{item.replace(/^\d+\.\s/, '')}</li>
                                ))}
                              </ol>
                            );
                          }
                          return <p key={index} className="mb-4">{paragraph}</p>;
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">
                        Preview will appear here as you write content
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <Input 
                  id="category" 
                  name="category" 
                  value={currentPost.category} 
                  onChange={handleInputChange} 
                  placeholder="Post category"
                />
              </div>
              
              <div>
                <label htmlFor="author" className="block text-sm font-medium mb-1">Author</label>
                <Input 
                  id="author" 
                  name="author" 
                  value={currentPost.author} 
                  onChange={handleInputChange} 
                  placeholder="Author name"
                />
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1">Image URL</label>
                <Input 
                  id="image" 
                  name="image" 
                  value={currentPost.image} 
                  onChange={handleInputChange} 
                  placeholder="Image URL"
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date"
                  value={currentPost.date?.split('T')[0]} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug (URL)</label>
                <Input 
                  id="slug" 
                  name="slug" 
                  value={currentPost.slug} 
                  onChange={handleInputChange} 
                  placeholder="post-url-slug"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The URL-friendly version of the title. Auto-generated for new posts.
                </p>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTagAdd();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleTagAdd}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentPost.tags && currentPost.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
                    >
                      {tag}
                      <button 
                        onClick={() => handleTagRemove(tag)} 
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={currentPost.published} 
                    onChange={() => setCurrentPost(prev => ({ ...prev, published: !prev.published }))}
                    className="mr-2"
                  />
                  <span>Published</span>
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogPostManager;
