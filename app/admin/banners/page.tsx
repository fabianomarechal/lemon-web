'use client'

import { initializeFirebaseClient } from '@/lib/firebase/index'
import { Banner, BannerFormData } from '@/lib/types/banner'
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<BannerFormData>({
    titulo: '',
    subtitulo: '',
    imagemUrl: '',
    linkDestino: '',
    textoLink: 'Ver Produtos',
    ativo: true,
    ordem: 1
  })
  
  // Inicializar Firebase
  const { clientDb: db } = initializeFirebaseClient()

  const carregarBanners = useCallback(async () => {
    if (!db || typeof window === 'undefined' || !mounted) return
    
    try {
      const q = query(collection(db, 'banners'), orderBy('ordem', 'asc'))
      const snapshot = await getDocs(q)
      const bannersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        criadoEm: doc.data().criadoEm?.toDate(),
        atualizadoEm: doc.data().atualizadoEm?.toDate()
      })) as Banner[]
      setBanners(bannersData)
    } catch (error) {
      console.error('Erro ao carregar banners:', error)
    } finally {
      setLoading(false)
    }
  }, [db, mounted])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      carregarBanners()
    }
  }, [mounted, carregarBanners])

  const handleImageUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload/banner', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erro no upload')
      }

      const result = await response.json()
      setFormData(prev => ({ ...prev, imagemUrl: result.url }))
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const bannerData = {
        ...formData,
        atualizadoEm: new Date()
      }

      if (editingBanner) {
        await updateDoc(doc(db, 'banners', editingBanner.id!), bannerData)
      } else {
        await addDoc(collection(db, 'banners'), {
          ...bannerData,
          criadoEm: new Date()
        })
      }

      await carregarBanners()
      resetForm()
      alert(editingBanner ? 'Banner atualizado!' : 'Banner criado!')
    } catch (error) {
      console.error('Erro ao salvar banner:', error)
      alert('Erro ao salvar banner')
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      titulo: banner.titulo,
      subtitulo: banner.subtitulo,
      imagemUrl: banner.imagemUrl || '',
      linkDestino: banner.linkDestino || '',
      textoLink: banner.textoLink || 'Ver Produtos',
      ativo: banner.ativo,
      ordem: banner.ordem
    })
    setShowForm(true)
  }

  const handleDelete = async (bannerId: string, imagemUrl?: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return

    try {
      await deleteDoc(doc(db, 'banners', bannerId))
      
      // Deletar imagem do Cloudinary se existir
      if (imagemUrl && imagemUrl.includes('cloudinary')) {
        try {
          // Extrair o public_id da URL do Cloudinary
          const parts = imagemUrl.split('/')
          const publicIdWithExtension = parts[parts.length - 1]
          const publicId = `banners/${publicIdWithExtension.split('.')[0]}`
          
          await fetch(`/api/upload/banner/delete?publicId=${encodeURIComponent(publicId)}`, {
            method: 'DELETE'
          })
        } catch (error) {
          console.error('Erro ao deletar imagem:', error)
        }
      }

      await carregarBanners()
      alert('Banner excluído!')
    } catch (error) {
      console.error('Erro ao excluir banner:', error)
      alert('Erro ao excluir banner')
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: '',
      subtitulo: '',
      imagemUrl: '',
      linkDestino: '',
      textoLink: 'Ver Produtos',
      ativo: true,
      ordem: 1
    })
    setEditingBanner(null)
    setShowForm(false)
  }

  if (loading || !mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Gerenciar Banners</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Novo Banner
          </button>
        </div>

        {/* Lista de Banners */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          {banners.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Nenhum banner encontrado. Crie seu primeiro banner!
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {banners.map((banner) => (
                <div key={banner.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {banner.titulo}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          banner.ativo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {banner.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                          Ordem: {banner.ordem}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-3">{banner.subtitulo}</p>
                      {banner.linkDestino && (
                        <p className="text-sm text-teal-600">
                          Link: {banner.linkDestino} ({banner.textoLink})
                        </p>
                      )}
                    </div>
                    
                    {banner.imagemUrl && (
                      <div className="ml-6">
                        <Image
                          src={banner.imagemUrl}
                          alt={banner.titulo}
                          width={100}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id!, banner.imagemUrl)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal do Formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingBanner ? 'Editar Banner' : 'Novo Banner'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subtítulo
                  </label>
                  <textarea
                    value={formData.subtitulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitulo: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagem do Banner
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      disabled={uploading}
                    />
                    {uploading && (
                      <p className="text-sm text-slate-500">Fazendo upload...</p>
                    )}
                    {formData.imagemUrl && (
                      <div className="mt-2">
                        <Image
                          src={formData.imagemUrl}
                          alt="Preview"
                          width={200}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Link de Destino (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.linkDestino}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkDestino: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Texto do Link
                  </label>
                  <input
                    type="text"
                    value={formData.textoLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, textoLink: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ordem
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.ordem}
                      onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.ativo ? 'true' : 'false'}
                      onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                  >
                    {editingBanner ? 'Atualizar' : 'Criar'} Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  )
}