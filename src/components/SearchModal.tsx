import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Post, fetchPosts } from '../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPost: (post: Post) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectPost }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const searchTimer = setTimeout(() => {
      setLoading(true);
      fetchPosts(undefined, query)
        .then(data => {
          if (ignore) return;
          
          // Strict client-side filtering to ensure the query actually matches the title or excerpt
          // This prevents WordPress from returning loosely related themes (e.g. from tags or deep content)
          const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 0);
          
          const filteredData = data.filter(post => {
            const title = post.title.rendered.toLowerCase();
            const excerpt = post.excerpt.rendered.toLowerCase();
            
            // Check if ALL search terms are present in either title or excerpt
            return searchTerms.every(term => title.includes(term) || excerpt.includes(term));
          });
          
          setResults(filteredData.length > 0 ? filteredData : data); // Fallback to WP results if strict filter is too aggressive
        })
        .catch(err => {
          if (!ignore) console.error("Error fetching posts for search:", err);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, 500); // 500ms debounce

    return () => {
      ignore = true;
      clearTimeout(searchTimer);
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-300">
      <div className="flex items-center p-5 lg:p-10 border-b border-border">
        <Search className="text-highlight mr-4" size={24} />
        <input 
          type="text" 
          autoFocus
          placeholder="O que você está procurando? (ex: He man, Heróis...)" 
          className="flex-1 bg-transparent text-accent text-xl lg:text-3xl font-serif focus:outline-none placeholder:text-muted"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={onClose} className="text-muted hover:text-accent transition-colors p-2">
          <X size={32} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 lg:p-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted">
            <Loader2 className="animate-spin mb-4 text-highlight" size={40} />
            <p className="text-lg font-serif">Buscando conteúdos...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {!query.trim() ? (
              <div className="text-center text-muted py-20">
                <Search className="mx-auto mb-4 opacity-50" size={48} />
                <p className="text-2xl font-serif mb-2">Comece a digitar para pesquisar</p>
                <p>Encontre artigos, curiosidades e muito mais.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center text-muted py-20">
                <p className="text-2xl font-serif mb-2">Nenhum resultado encontrado para "{query}"</p>
                <p>Tente usar outras palavras-chave.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map(post => (
                  <div 
                    key={post.id} 
                    onClick={() => {
                      onSelectPost(post);
                      onClose();
                    }}
                    className="bg-card-bg border border-border cursor-pointer group hover:border-highlight transition-colors flex flex-col h-full overflow-hidden relative"
                  >
                    {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                      <div className="w-full h-48 overflow-hidden bg-bg relative">
                        <img 
                          src={post._embedded['wp:featuredmedia'][0].source_url} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80"></div>
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 
                        className="text-lg font-serif font-bold mb-3 group-hover:text-highlight transition-colors line-clamp-2 leading-snug"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      <div 
                        className="text-sm text-muted line-clamp-2 mb-4"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
