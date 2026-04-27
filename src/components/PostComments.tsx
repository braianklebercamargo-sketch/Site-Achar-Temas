import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { fetchComments, WPComment } from '../services/api';

interface FSComment {
  id: string;
  postId: number;
  userId: string;
  userName: string;
  userPhoto: string | null;
  content: string;
  createdAt: any;
}

export default function PostComments({ postId, user }: { postId: number, user: User | null }) {
  const [wpComments, setWpComments] = useState<WPComment[]>([]);
  const [fsComments, setFsComments] = useState<FSComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch WP Comments locally
    fetchComments(postId).then(data => {
      setWpComments(data);
    }).catch(err => console.error("Error fetching local WP comments:", err));

    // Listen to Firestore Comments
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData: FSComment[] = [];
      snapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as FSComment);
      });
      setFsComments(commentsData);
    }, (error) => {
      console.error("Firestore Error: ", JSON.stringify({
        error: error.message,
        operationType: 'list',
        path: 'comments',
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email
        }
      }));
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        userId: user.uid,
        userName: user.displayName || 'Usuário',
        userPhoto: user.photoURL,
        content: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error: any) {
      console.error("Firestore Error: ", JSON.stringify({
        error: error.message,
        operationType: 'create',
        path: 'comments',
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email
        }
      }));
      alert("Erro ao enviar comentário. Verifique se você está logado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-2xl font-serif font-bold mb-6 text-accent">Comentários</h3>
      
      {/* List Comments */}
      <div className="space-y-6 mb-8">
        {wpComments.map(comment => (
          <div key={`wp-${comment.id}`} className="bg-card-bg p-4 border border-border rounded">
            <div className="flex items-center gap-3 mb-3">
              {comment.author_avatar_urls && comment.author_avatar_urls['48'] ? (
                <img src={comment.author_avatar_urls['48']} alt={comment.author_name} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 bg-border rounded-full flex items-center justify-center text-xs font-bold">
                  {comment.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-bold text-sm text-accent">{comment.author_name}</div>
                <div className="text-xs text-muted">{new Date(comment.date).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="text-sm text-accent prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
          </div>
        ))}

        {fsComments.map(comment => (
          <div key={`fs-${comment.id}`} className="bg-card-bg p-4 border border-border rounded">
            <div className="flex items-center gap-3 mb-3">
              {comment.userPhoto ? (
                <img src={comment.userPhoto} alt={comment.userName} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 bg-border rounded-full flex items-center justify-center text-xs font-bold">
                  {comment.userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-bold text-sm text-accent">{comment.userName}</div>
                <div className="text-xs text-muted">
                  {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Agora'}
                </div>
              </div>
            </div>
            <div className="text-sm text-accent whitespace-pre-wrap">{comment.content}</div>
          </div>
        ))}

        {wpComments.length === 0 && fsComments.length === 0 && (
          <p className="text-muted text-sm italic">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        )}
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-card-bg p-5 border border-border rounded">
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-muted">Deixe um comentário</h4>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="O que você achou deste tema?"
            className="w-full bg-bg border border-border p-3 text-accent focus:outline-none focus:border-highlight transition-colors resize-none mb-3 rounded"
            rows={4}
            required
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
            className="bg-highlight text-white px-6 py-2 font-bold uppercase tracking-wider text-xs hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded cursor-pointer"
          >
            {isSubmitting ? 'Enviando...' : 'Comentar'}
          </button>
        </form>
      ) : (
        <div className="bg-card-bg p-5 border border-border rounded text-center">
          <p className="text-muted mb-3 text-sm">Faça login para deixar um comentário e compartilhar suas experiências.</p>
        </div>
      )}
    </div>
  );
}
