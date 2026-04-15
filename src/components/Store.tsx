import { ShoppingBag, ExternalLink } from 'lucide-react';

export default function Store() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-20 w-full max-w-4xl mx-auto text-center">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-highlight/10 rounded-full flex items-center justify-center mb-8 mx-auto">
          <ShoppingBag size={40} className="text-highlight" />
        </div>
        
        <div className="text-highlight text-xs font-bold tracking-[4px] uppercase mb-4">
          Nossa Coleção Exclusiva
        </div>
        
        <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[60px] leading-[1.1] font-black mb-6 text-accent">
          NEVER STOP DREAMING
        </h2>
        
        <p className="text-[16px] lg:text-[18px] leading-[1.8] text-muted mb-12 max-w-2xl mx-auto">
          Explore nossa seleção curada de produtos na Shopee. Reunimos os melhores achados, gadgets e itens de decoração que amamos, tudo em um só lugar para facilitar sua navegação.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="https://collshp.com/neverstopdreaming?view=storefront" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-highlight text-white px-10 py-5 rounded font-bold uppercase tracking-[2px] text-sm hover:bg-white hover:text-black transition-all shadow-2xl shadow-highlight/30 hover:-translate-y-1"
          >
            Acessar Vitrine Shopee <ExternalLink size={18} />
          </a>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border w-full max-w-md mx-auto">
          <p className="text-[11px] uppercase tracking-widest text-muted font-bold">
            Compra Segura via Shopee Affiliate
          </p>
        </div>
      </div>
    </div>
  );
}
