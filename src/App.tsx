import { Instagram, LogOut, AlertCircle, Menu, ArrowLeft, Facebook, Twitter, Share2, Search, Sun, Moon, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { fetchPosts, Post } from './services/api';
import PostComments from './components/PostComments';
import SearchModal from './components/SearchModal';
import Store from './components/Store';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  const [posts, setPosts] = useState<Post[]>([]);
  const [cachedPosts, setCachedPosts] = useState<Record<string, Post[]>>({});
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<{title: string, categoryIds: number[]} | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.add('light');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieConsent(false);
  };

  useEffect(() => {
    if (activeTab === 'posts') {
      const isGeneral = !selectedCategoryGroup || selectedCategoryGroup.categoryIds.length === 0;
      const cacheKey = isGeneral ? 'all_posts' : selectedCategoryGroup.categoryIds.join(',');
      
      if (cachedPosts[cacheKey]) {
        setPosts(cachedPosts[cacheKey]);
        setLoadingPosts(false);
        return;
      }

      setLoadingPosts(true);
      fetchPosts(isGeneral ? undefined : selectedCategoryGroup.categoryIds)
        .then(data => {
          setPosts(data);
          setCachedPosts(prev => ({ ...prev, [cacheKey]: data }));
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingPosts(false));
    }
  }, [activeTab, selectedCategoryGroup, cachedPosts]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Erro ao fazer login com o Google:", error);
      if (error.code === 'auth/popup-blocked') {
        setAuthError("O pop-up de login foi bloqueado pelo navegador. Por favor, permita pop-ups para este site ou abra o aplicativo em uma nova guia clicando no ícone no canto superior direito.");
      } else {
        setAuthError("Ocorreu um erro ao tentar fazer login.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const categoryGroups = [
    {
      title: 'Cultura Pop & História',
      categoryIds: [49, 52],
      bgImage: 'url("https://image.pollinations.ai/prompt/Michael%20Jackson%20performing%20on%20stage%20in%20the%201980s%2C%20vibrant%20red%20leather%20jacket%2C%20epic%20concert%20lighting%2C%20hyper-realistic%20pop%20culture%20icon%2C%208k%20resolution%2C%20cinematic?width=800&height=600&nologo=true&seed=901")',
      bgSize: 'cover'
    },
    {
      title: 'Biodiversidade & Ciência',
      categoryIds: [50, 45],
      bgImage: 'url("https://image.pollinations.ai/prompt/Macro%20photography%20of%20a%20beautiful%20exotic%20insect%20on%20a%20glowing%20bioluminescent%20plant%2C%20highly%20detailed%20nature%20discovery%2C%20cinematic%20science%2C%20national%20geographic%20style?width=800&height=600&nologo=true&seed=902")',
      bgSize: 'cover'
    },
    {
      title: 'Arte & Curiosidades',
      categoryIds: [44, 47],
      bgImage: 'url("https://image.pollinations.ai/prompt/A%20stunning%20modern%20art%20museum%20gallery%20with%20classic%20marble%20statues%20and%20surrealist%20paintings%2C%20golden%20hour%20lighting%20pouring%20through%20large%20windows%2C%20aesthetic?width=800&height=600&nologo=true&seed=903")',
      bgSize: 'cover'
    },
    {
      title: 'Gastronomia, Moda & Transportes',
      categoryIds: [51, 38, 48],
      bgImage: 'url("https://image.pollinations.ai/prompt/A%20gourmet%20fine%20dining%20dish%20on%20a%20table%20next%20to%20a%20haute%20couture%20fashion%20magazine%2C%20elegant%20vintage%20sports%20car%20seen%20through%20the%20window%2C%20lifestyle%20luxury%20photography?width=800&height=600&nologo=true&seed=904")',
      bgSize: 'cover'
    }
  ];

  const handleCategoryClick = (group: {title: string, categoryIds: number[]}) => {
    setSelectedCategoryGroup(group);
    setSelectedPost(null);
    setActiveTab('posts');
  };

  const handleCategoryHover = (group: {title: string, categoryIds: number[]}) => {
    const cacheKey = group.categoryIds.join(',');
    if (!cachedPosts[cacheKey]) {
      fetchPosts(group.categoryIds).then(data => {
        setCachedPosts(prev => ({ ...prev, [cacheKey]: data }));
      }).catch(() => {}); // Ignore errors on prefetch
    }
  };

  const postPrompts: Record<number, string> = {
    685: "Epic cinematic shot of Emperor Constantine looking at a glowing cross in the sky, ancient Roman legions, hyper-realistic, 8k resolution, historical masterpiece",
    678: "Hyper-realistic historical painting of the Resurrection of Christ, brilliant divine light from a tomb in ancient Jerusalem, shocked Roman guards, dramatic lighting",
    669: "Historical painting of ancient carnival festival, colorful Venetian masks, religious symbolism, dramatic street celebration, vibrant, atmospheric",
    666: "Cymatics sound wave patterns forming intricate geometric Chladni figures on a brass plate covered in sand, glowing neon acoustic vibrations, macro photography",
    659: "80s superhero holding a glowing magical sword aloft, stormy sky with lightning, Castle Grayskull in background, epic epic fantasy art, hyper-realistic pop culture",
    655: "1990s grunge rock band performing on stage, lead singer roaring into microphone, flannel shirts, packed underground club, moody concert lighting",
    650: "A beautiful, spiraling herb garden made of natural stone, filled with lush green culinary herbs, golden hour sunlight, hyper-realistic gardening photography",
    645: "A gentle manatee swimming in crystal clear blue spring water, underwater photography, highly detailed, beautiful sunrays piercing the water",
    639: "Olympic swimmer doing the butterfly stroke, splashing water, dramatic underwater cinematic view, athlete in motion, highly detailed sports photography",
    599: "Cozy magical Christmas scene, ancient origins of Yule, snowy pine forest, warm glowing fire, historical winter solstice celebration, hyper-realistic",
    594: "Robert Hooke looking through an antique 17th-century brass microscope in a candlelit study, scientific revolution, historical painting style",
    589: "Nikola Tesla examining a giant glowing Tesla coil in his laboratory, electricity arcing, steampunk vibes, historical portrait, dramatic lighting",
    584: "Albert Einstein writing complex astrophysics equations on a giant chalkboard, deep in thought, hyper-realistic portrait photography",
    579: "Isaac Newton sitting under an apple tree, holding a prism refracting rainbow light, 17th-century English countryside, historical realistic art",
    574: "Leonardo da Vinci in his Renaissance studio, drafting the Vitruvian Man, surrounded by inventions and oil paintings, cinematic historical lighting",
    570: "An artist painting a stunning cubist portrait in a messy bohemian studio, vibrant abstract colors, Pablo Picasso style aesthetic",
    560: "A stunning hyper-realistic landscape photograph blending into Vincent Van Gogh's Starry Night style, swirling sky, cypress trees, glowing stars",
    554: "Vintage 1920s biplane flying over a beautiful green landscape, sepia tone warmth, history of aviation, hyper-realistic aerial photography",
    543: "Classic early 20th-century vintage car driving on a dusty road, industrial revolution, history of the combustion engine, cinematic realism",
    536: "A massive, powerful steam locomotive train speeding through a snowy mountain pass, billowing white smoke, dramatic industrial photography",
    529: "A surreal, emotional concept art piece representing overcoming anxiety, a person emerging from a dark storm into a calm, beautiful sunlit meadow",
    515: "Highly detailed 3D medical visualization of a healthy glowing human brain, neural pathways lighting up, scientific medical art",
    508: "Beautiful haute couture fashion sketch made from sustainable natural materials, leaves and organic fabrics, eco-friendly fashion photography",
    497: "A delicious spread of traditional Southern Brazilian food, churrasco barbecue, chimarrão mate tea, rustic wooden table, hyper-realistic food photography",
    484: "Macro photography of a honeybee pollinating a vibrant yellow sunflower, highly detailed wings, golden pollen, nature documentary style",
    475: "A beautiful English cottage garden path lined with vibrant colorful blooming flowers, peaceful nature scene, spring morning sunlight",
    462: "An athlete running powerfully on an asphalt road at sunrise, dramatic silhouette, dust particle effects, intense sports photography, 8k",
    420: "A classic comic book style superhero standing tall on a skyscraper gargoyle overlooking a rainy neon city at night, epic cinematic lighting",
    400: "A beautiful acoustic guitar resting against an old vintage amplifier in a sunny room, floating golden dust motes, music photography",
    368: "Macro photography of colorful, beautiful, complex microscopic mold spores spreading like an alien forest, scientific abstract, vibrant colors",
    307: "An ancient Roman stone road winding through a lush green valley in Italy, historic architecture, cinematic landscape photography",
    294: "The ancient Egyptian Pyramids of Giza at sunset, towering monuments of engineering, golden desert sand, hyper-realistic historical photography",
    280: "A time-lapse composite image showing historical stone castles transitioning into modern glass skyscrapers, architectural evolution, epic",
    183: "Luxurious modern home interior, smart home technology, sleek minimalist finishes, glowing ambient LED lighting, architectural digest style",
    172: "Beautiful rustic home built from eco-friendly recycled brick and warm timber, affordable sustainable architecture, hyper-realistic",
    154: "A craftsman pouring concrete into custom wooden molds, DIY home construction, workshop setting, warm natural lighting, realistic"
  };

  const getPostImage = (post: Post) => {
    if (post.id === 599) {
      return '/regenerated_image_1777480656768.png';
    }
    if (post.id === 594) {
      return '/regenerated_image_1777480657911.png';
    }

    // Check if we have a downloaded local image for this post
    const localImageMap: Record<number, string> = {
      154: 'content-154-image-1.jpg',
      280: 'content-280-image.jpg',
      294: 'content-294-image-4.jpg',
      307: 'content-307-image-7.jpg',
      368: 'content-368-image.jpg',
      400: 'content-400-image-4.jpg',
      420: 'content-420-image-7.jpg',
      462: 'content-462-WhatsApp-Image-2025-08-25-at-21.43.21-1024x768.jpeg',
      475: 'content-475-image.jpg',
      484: 'content-484-image-2.jpg',
      497: 'content-497-image-4.jpg',
      508: 'content-508-image-6.jpg',
      515: 'content-515-image-1.jpg',
      529: 'content-529-image-4.jpg',
      536: 'content-536-image-6.jpg',
      543: 'content-543-image-9.jpg',
      554: 'content-554-image-11.jpg',
      560: 'content-560-image.jpg',
      570: 'content-570-image-2.jpg',
      574: 'content-574-image-3.jpg',
      579: 'content-579-image-4.jpg',
      584: 'content-584-image.jpg',
      589: 'content-589-image-1.jpg',
      594: 'content-594-image-2.jpg',
      599: 'content-599-image-3.jpg',
      639: 'content-639-image.jpg',
      645: 'content-645-image-1.jpg',
      650: 'content-650-image-2.jpg',
      655: 'content-655-image-3.jpg',
      659: 'content-659-WhatsApp-Image-2026-01-30-at-21.00.45-1024x682.jpeg',
      666: 'content-666-image.jpg',
      669: 'content-669-image-1.jpg',
      678: 'content-678-image-2.jpg',
      685: 'content-685-image-4.jpg'
    };

    if (localImageMap[post.id]) {
      return `/wp-images/${localImageMap[post.id]}`;
    }

    let prompt = postPrompts[post.id];
    
    if (!prompt) {
      // Fallback for new/unknown posts
      const cleanTitle = post.title.rendered
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-zA-Z0-9 ]/g, " ") // Remove special chars
        .substring(0, 50)
        .trim();
      prompt = `Highly detailed aesthetic photograph of ${cleanTitle}, hyper-realistic, 8k resolution, cinematic lighting`;
    }
    
    const seed = post.id || Math.floor(Math.random() * 1000);
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${seed}`;
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-screen w-full bg-bg text-accent font-sans lg:overflow-hidden relative">
      {authError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 max-w-md w-[90%] border border-red-700">
          <AlertCircle className="shrink-0" size={20} />
          <p className="text-sm">{authError}</p>
          <button onClick={() => setAuthError(null)} className="ml-auto text-white/70 hover:text-white">✕</button>
        </div>
      )}
      
      <header className="sticky top-0 h-auto min-h-[80px] py-4 lg:py-0 px-5 lg:px-10 flex items-center justify-between border-b border-border shrink-0 gap-4 z-40 bg-bg shadow-md">
        <div className="flex-1 hidden md:block">
          <nav className="flex gap-[15px] lg:gap-[20px] text-[10px] lg:text-[12px] uppercase tracking-[1px] text-muted">
            <span onClick={() => { setActiveTab('inicio'); setSelectedPost(null); setSelectedCategoryGroup(null); }} className={`cursor-pointer pb-1 transition-colors ${activeTab === 'inicio' ? 'text-accent border-b-2 border-highlight' : 'hover:text-accent'}`}>Início</span>
            <span onClick={() => { setActiveTab('posts'); setSelectedPost(null); setSelectedCategoryGroup({title: "Últimos Artigos", categoryIds: []}); }} className={`cursor-pointer pb-1 transition-colors ${activeTab === 'posts' ? 'text-accent border-b-2 border-highlight' : 'hover:text-accent'}`}>Artigos</span>
            <span onClick={() => { setActiveTab('loja'); setSelectedPost(null); setSelectedCategoryGroup(null); }} className={`cursor-pointer pb-1 transition-colors ${activeTab === 'loja' ? 'text-accent border-b-2 border-highlight' : 'hover:text-accent'}`}>Loja</span>
            <span onClick={() => { setActiveTab('servicos'); setSelectedPost(null); setSelectedCategoryGroup(null); }} className={`cursor-pointer pb-1 transition-colors ${activeTab === 'servicos' ? 'text-accent border-b-2 border-highlight' : 'hover:text-accent'}`}>Serviços</span>
            <span onClick={() => { setActiveTab('quem-somos'); setSelectedPost(null); setSelectedCategoryGroup(null); }} className={`cursor-pointer pb-1 transition-colors ${activeTab === 'quem-somos' ? 'text-accent border-b-2 border-highlight' : 'hover:text-accent'}`}>Quem Somos</span>
            <span onClick={() => { setActiveTab('contato'); setSelectedPost(null); setSelectedCategoryGroup(null); }} className={`cursor-pointer pb-1 transition-colors ${activeTab === 'contato' ? 'text-accent border-b-2 border-highlight' : 'hover:text-accent'}`}>Contato</span>
          </nav>
        </div>

        <button 
          onClick={() => {
            setActiveTab('inicio');
            setSelectedPost(null);
            setSelectedCategoryGroup(null);
          }}
          className="flex items-center gap-2 lg:gap-3 hover:opacity-80 transition-opacity text-center md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          <img src="/regenerated_image_1777470915146.png" alt="Logo" className="w-6 h-6 lg:w-8 lg:h-8 object-contain rounded" />
          <div className="font-serif font-black text-lg sm:text-xl lg:text-2xl tracking-[-1px] uppercase">
            Achar Temas
          </div>
        </button>
        
        <div className="flex items-center gap-3 lg:gap-4 flex-1 justify-end">
          <button 
            onClick={toggleTheme}
            className="text-accent hover:text-highlight transition-colors p-2"
            title={isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-accent hover:text-highlight transition-colors p-2"
            title="Pesquisar"
          >
            <Search size={20} />
          </button>

          {loading ? (
            <div className="w-20 h-8 bg-border animate-pulse rounded"></div>
          ) : user ? (
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img src={user.photoURL} alt="Avatar" className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border border-border" referrerPolicy="no-referrer" />
                )}
                <span className="text-[10px] lg:text-xs font-bold hidden sm:block">{user.displayName?.split(' ')[0]}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-border text-accent px-2 py-1.5 lg:px-3 lg:py-2 rounded text-[10px] lg:text-xs font-bold uppercase cursor-pointer hover:bg-muted/20 transition-colors flex items-center gap-1.5 lg:gap-2"
                title="Sair"
              >
                <LogOut size={14} />
                <span className="hidden sm:block">Sair</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="bg-highlight text-white px-3 py-2 lg:px-5 lg:py-2.5 rounded text-[10px] lg:text-xs font-bold uppercase cursor-pointer hover:bg-white hover:text-black transition-colors"
            >
              <span className="hidden sm:inline">Entrar com Google</span>
              <span className="sm:hidden">Entrar</span>
            </button>
          )}
          
          <button 
            className="md:hidden text-accent p-1" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[80px] left-0 right-0 bg-bg border-b border-border z-30 flex flex-col p-5 gap-4 shadow-2xl">
          <span onClick={() => { setActiveTab('inicio'); setSelectedPost(null); setSelectedCategoryGroup(null); setMobileMenuOpen(false); }} className={`pb-2 border-b border-border uppercase tracking-[2px] text-xs transition-colors cursor-pointer ${activeTab === 'inicio' ? 'text-accent font-bold' : 'text-muted hover:text-accent'}`}>Início</span>
          <span onClick={() => { setActiveTab('posts'); setSelectedPost(null); setSelectedCategoryGroup({title: 'Últimos Artigos', categoryIds: []}); setMobileMenuOpen(false); }} className={`pb-2 border-b border-border uppercase tracking-[2px] text-xs transition-colors cursor-pointer ${activeTab === 'posts' ? 'text-accent font-bold' : 'text-muted hover:text-accent'}`}>Artigos</span>
          <span onClick={() => { setActiveTab('loja'); setSelectedPost(null); setSelectedCategoryGroup(null); setMobileMenuOpen(false); }} className={`pb-2 border-b border-border uppercase tracking-[2px] text-xs transition-colors cursor-pointer ${activeTab === 'loja' ? 'text-accent font-bold' : 'text-muted hover:text-accent'}`}>Loja</span>
          <span onClick={() => { setActiveTab('servicos'); setSelectedPost(null); setSelectedCategoryGroup(null); setMobileMenuOpen(false); }} className={`pb-2 border-b border-border uppercase tracking-[2px] text-xs transition-colors cursor-pointer ${activeTab === 'servicos' ? 'text-accent font-bold' : 'text-muted hover:text-accent'}`}>Serviços</span>
          <span onClick={() => { setActiveTab('quem-somos'); setSelectedPost(null); setSelectedCategoryGroup(null); setMobileMenuOpen(false); }} className={`pb-2 border-b border-border uppercase tracking-[2px] text-xs transition-colors cursor-pointer ${activeTab === 'quem-somos' ? 'text-accent font-bold' : 'text-muted hover:text-accent'}`}>Quem Somos</span>
          <span onClick={() => { setActiveTab('contato'); setSelectedPost(null); setSelectedCategoryGroup(null); setMobileMenuOpen(false); }} className={`pb-2 uppercase tracking-[2px] text-xs transition-colors cursor-pointer ${activeTab === 'contato' ? 'text-accent font-bold' : 'text-muted hover:text-accent'}`}>Contato</span>
        </div>
      )}

      <main className={`flex-1 flex flex-col lg:overflow-hidden ${activeTab === 'inicio' ? 'lg:grid lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr]' : ''}`}>
        {activeTab === 'inicio' && (
          <>
            <section className="p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between lg:overflow-y-auto">
              <div>
                <div className="text-highlight text-[10px] lg:text-xs font-bold tracking-[3px] uppercase mb-3 lg:mb-2.5">
                  Um mundo de conhecimento
                </div>
                <h1 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] leading-[1] font-black mb-4 lg:mb-6 text-accent break-words">
                  ENTENDA O MUNDO COM MAIS CLAREZA
                </h1>
                <p className="text-[14px] lg:text-[16px] leading-[1.6] text-muted mb-6 lg:mb-[30px]">
                  Um blog criado especialmente para você encontrar respostas e explorar novas ideias. Nosso conteúdo abrange diversas áreas do conhecimento. Se você está buscando informação com temas interessantes e relevantes, explicações diretas ou apenas quer aprender algo novo, no Achar Temas você vai se sentir em casa. Escolha um tema e dê início à sua jornada!
                </p>
                <p className="text-xs lg:text-sm text-highlight font-bold uppercase tracking-wider">
                  Por Neverson Camargo
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-8 lg:mt-0">
                <a 
                  href="https://www.instagram.com/achar.temas?igsh=eTlqaGNwYnYydzB6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card-bg p-4 lg:p-5 border-l-4 border-highlight flex items-center gap-3 lg:gap-[15px] hover:bg-muted/10 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-border rounded-full flex items-center justify-center text-highlight shrink-0 group-hover:scale-110 transition-transform">
                    <Instagram size={14} className="lg:w-4 lg:h-4" />
                  </div>
                  <div className="text-[10px] lg:text-xs flex flex-col gap-1">
                    <span className="font-bold">Acesse nossa página no Instagram</span>
                    <span className="text-muted">Siga-nos para mais conteúdos</span>
                  </div>
                </a>

                <button 
                  onClick={() => setActiveTab('loja')}
                  className="bg-card-bg p-4 lg:p-5 border-l-4 border-highlight flex items-center gap-3 lg:gap-[15px] hover:bg-muted/10 transition-colors cursor-pointer group text-left"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-border rounded-full flex items-center justify-center text-highlight shrink-0 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={14} className="lg:w-4 lg:h-4" />
                  </div>
                  <div className="text-[10px] lg:text-xs flex flex-col gap-1">
                    <span className="font-bold">Visite nossa Loja Shopee</span>
                    <span className="text-muted">Confira nossa coleção exclusiva</span>
                  </div>
                </button>
              </div>
            </section>

            <section className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 lg:overflow-y-auto">
              {categoryGroups.map((group, index) => (
                <div 
                  key={index}
                  onClick={() => handleCategoryClick(group)}
                  onMouseEnter={() => handleCategoryHover(group)}
                  className="bg-card-bg border border-border relative overflow-hidden flex items-end p-5 min-h-[200px] lg:min-h-[250px] group cursor-pointer" 
                >
                  <div 
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                    style={{ 
                      backgroundImage: group.bgImage, 
                      backgroundSize: group.bgSize, 
                      backgroundPosition: 'center', 
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: (group as any).bgColor || 'transparent' 
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-colors duration-500"></div>
                  <div className="relative z-10 flex flex-col gap-2">
                    <div className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[2px] text-highlight">Explorar</div>
                    <div className="text-lg lg:text-xl font-serif font-bold text-white group-hover:text-highlight transition-colors">{group.title}</div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {activeTab === 'posts' && (
          <section className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto w-full max-w-4xl mx-auto">
            {selectedPost ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-2 text-muted hover:text-highlight transition-colors mb-8"
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm font-bold uppercase tracking-wider">Voltar para {selectedCategoryGroup?.title}</span>
                </button>
                
                <h1 
                  className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight"
                  dangerouslySetInnerHTML={{ __html: selectedPost.title.rendered }}
                />
                
                {getPostImage(selectedPost) && (
                  <img 
                    src={getPostImage(selectedPost)} 
                    alt="Featured" 
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[500px] object-cover object-center mb-6 border border-border"
                  />
                )}

                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                  <span className="text-sm font-bold uppercase tracking-wider text-muted">Compartilhar:</span>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-card-bg border border-border flex items-center justify-center text-accent hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-colors cursor-pointer">
                      <Facebook size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-card-bg border border-border flex items-center justify-center text-accent hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white transition-colors cursor-pointer">
                      <Twitter size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-card-bg border border-border flex items-center justify-center text-accent hover:bg-highlight hover:border-highlight hover:text-white transition-colors cursor-pointer">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div 
                  className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-accent prose-a:text-highlight prose-img:hidden"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content.rendered }}
                />
                
                <PostComments postId={selectedPost.id} user={user} />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                  onClick={() => setActiveTab('inicio')}
                  className="flex items-center gap-2 text-[#666] hover:text-highlight transition-colors mb-8"
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm font-bold uppercase tracking-wider">Voltar para Início</span>
                </button>

                <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-8 pb-4 border-b border-[#222]">
                  {selectedCategoryGroup?.title}
                </h2>

                {loadingPosts ? (
                  <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-highlight border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map(post => (
                      <div 
                        key={post.id} 
                        onClick={() => setSelectedPost(post)}
                        className="bg-card-bg border border-border cursor-pointer group hover:border-highlight transition-colors flex flex-col h-full overflow-hidden relative"
                      >
                        {getPostImage(post) && (
                          <div className="w-full h-56 overflow-hidden bg-bg relative">
                            <div className="absolute top-3 left-3 bg-highlight text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 z-10">
                              {selectedCategoryGroup?.title}
                            </div>
                            <img 
                              src={getPostImage(post)} 
                              alt="Thumbnail" 
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80"></div>
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 
                            className="text-xl font-serif font-bold mb-3 group-hover:text-highlight transition-colors line-clamp-2 leading-snug"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                          />
                          <div 
                            className="text-sm text-muted line-clamp-3 mb-5"
                            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                          />
                          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-highlight text-xs font-bold uppercase tracking-wider group-hover:underline">
                              Leia Mais
                            </span>
                            <ArrowLeft size={14} className="text-highlight rotate-180 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center py-20">Nenhum artigo encontrado nesta categoria.</p>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'quem-somos' && (
          <section className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 p-6 sm:p-10 lg:p-20 overflow-y-auto">
            <div className="shrink-0 relative">
              <div className="absolute inset-0 bg-highlight rounded-full blur-xl opacity-20"></div>
              <img 
                src="/regenerated_image_1777479020651.png" 
                alt="Neverson Camargo" 
                loading="lazy"
                decoding="async"
                className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-cover rounded-full border-4 border-[#222] relative z-10 shadow-2xl"
              />
            </div>
            <div className="max-w-xl text-center md:text-left">
              <div className="text-highlight text-xs font-bold tracking-[3px] uppercase mb-3">
                O Criador
              </div>
              <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] font-black mb-4 text-accent">
                Neverson Camargo
              </h2>
              <p className="text-[15px] lg:text-[17px] leading-[1.7] text-muted mb-6">
                Sou o idealizador do Achar Temas, um hub cultural criado para explorar novas ideias e encontrar respostas para as perguntas mais instigantes. Meu objetivo é transformar o engajamento em uma experiência imersiva e enriquecedora, trazendo conteúdos de qualidade sobre história, ciência, arte e muito mais.
              </p>
              <button 
                onClick={() => setActiveTab('contato')}
                className="bg-highlight text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-opacity-80 transition-colors cursor-pointer"
              >
                Entrar em Contato
              </button>
            </div>
          </section>
        )}

        {activeTab === 'loja' && (
          <Store />
        )}

        {activeTab === 'servicos' && (
          <section className="flex-1 p-6 sm:p-10 lg:p-20 overflow-y-auto w-full max-w-4xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-8 pb-4 border-b border-border">Nossos Serviços</h2>
              
              <div className={`prose ${isDarkMode ? 'prose-invert' : ''} prose-lg max-w-none prose-headings:font-serif prose-headings:text-accent prose-a:text-highlight`}>
                <h3>Conhecimento que faz a diferença</h3>
                <p>No achartemas.com, oferecemos muito mais do que simples informações. Nosso objetivo é compartilhar entretenimento e conhecimento. Além disso, buscamos sempre facilitar a sua rotina com conteúdos diretos e acessíveis.</p>
                <p>Cada artigo, dica ou curiosidade é criado com propósito: ajudar você conhecer algo importante que poderia ainda não saber, ou seja, expandir seu entendimento sobre temas variados. Por isso, se você busca um espaço confiável, com textos objetivos e relevantes, encontrou o lugar certo.</p>
                <p>Você não precisa perder tempo com conteúdos complexos ou genéricos. Aqui, você encontra o que realmente importa, com explicações claras e prontas para uso.</p>

                <h3>Como funciona o achartemas.com</h3>
                <p>Nosso serviço é totalmente gratuito, pensado para ser simples e eficiente. Publicamos artigos com linguagem leve, estrutura clara e uma abordagem sempre prática. Em cada postagem, você encontrará dicas úteis, tutoriais rápidos e curiosidades que despertam seu interesse.</p>
                <p>Além disso, revisamos e atualizamos nossos conteúdos com frequência. Isso garante que você tenha acesso às informações mais recentes, confiáveis e alinhadas com o que realmente precisa.</p>
                <p>Por esse motivo, abordamos temas variados: desde cultura pop até fatos históricos que ajudam a ampliar sua visão de mundo. Tudo isso com foco na sua experiência de leitura e aprendizado.</p>
                <p>Com o tempo, você perceberá que o nosso compromisso é constante: oferecer conteúdo útil, aplicável e relevante para o seu cotidiano.</p>

                <h3>Como aproveitar nosso conteúdo</h3>
                <p>Explorar o achartemas.com é simples, rápido e totalmente livre de custos. Basta navegar pelas categorias, escolher os assuntos que mais te interessam. A leitura trará conhecimento referente o tema pesquisado.</p>
                <p>Além disso, retornando regularmente ao site, você sempre encontrará conteúdos atualizados. A cada visita, há algo novo esperando por você como um fato histórico ou uma curiosidade que vale a pena conhecer.</p>
                <p>Portanto, se você valoriza conteúdo claro, direto ao ponto e realmente útil, aproveite tudo o que oferecemos. Quanto mais você explora, mais conhecimento irá agrega — e mais valor extrai de cada leitura.</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'contato' && (
          <section className="flex-1 p-6 sm:p-10 lg:p-20 overflow-y-auto w-full max-w-4xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-8 pb-4 border-b border-border">Contato</h2>
              
              <div className="bg-card-bg border border-border p-8 max-w-2xl mx-auto">
                <p className="text-muted text-lg mb-8 text-center">
                  Tem alguma dúvida, sugestão ou quer falar com a gente? Envie uma mensagem!
                </p>
                
                <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada com sucesso!'); }}>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-muted">Nome</label>
                    <input type="text" required className="w-full bg-bg border border-border p-3 text-accent focus:outline-none focus:border-highlight transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-muted">E-mail</label>
                    <input type="email" required className="w-full bg-bg border border-border p-3 text-accent focus:outline-none focus:border-highlight transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-muted">Mensagem</label>
                    <textarea required rows={5} className="w-full bg-bg border border-border p-3 text-accent focus:outline-none focus:border-highlight transition-colors resize-none"></textarea>
                  </div>
                  <button type="submit" className="bg-highlight text-white font-bold uppercase tracking-wider py-4 mt-2 hover:bg-white hover:text-black transition-colors cursor-pointer">
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="py-5 lg:py-0 lg:h-[60px] bg-bg border-t border-border flex flex-col lg:flex-row items-center justify-between px-5 lg:px-10 text-[10px] lg:text-[11px] text-muted shrink-0 gap-3 lg:gap-0 text-center lg:text-left">
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 lg:gap-5">
          <span className="hover:text-accent cursor-pointer transition-colors">Política de Privacidade</span>
          <span className="hover:text-accent cursor-pointer transition-colors">Termos de Uso</span>
          <span className="hover:text-accent cursor-pointer transition-colors">Política de Comentários</span>
        </div>
        <div>© 2024 Achar Temas — Neverson Camargo</div>
      </footer>

      {/* Cookie Consent Banner */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-border p-4 lg:p-6 z-50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-500">
          <div className="text-sm text-accent max-w-4xl">
            <p>
              Utilizamos cookies para melhorar sua experiência no Achar Temas, personalizar conteúdo e anúncios, e analisar nosso tráfego. 
              Ao continuar navegando, você concorda com a nossa <span className="text-highlight cursor-pointer hover:underline">Política de Cookies</span> e <span className="text-highlight cursor-pointer hover:underline">Política de Privacidade</span>.
            </p>
          </div>
          <div className="flex gap-3 shrink-0 w-full sm:w-auto">
            <button 
              onClick={handleAcceptCookies}
              className="flex-1 sm:flex-none bg-highlight text-white px-6 py-2.5 rounded font-bold uppercase tracking-wider text-xs hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              Aceitar
            </button>
          </div>
        </div>
      )}

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelectPost={(post) => {
          setSelectedPost(post);
          setActiveTab('posts');
        }} 
      />
    </div>
  );
}
