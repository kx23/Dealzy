import React, { useState, useRef, useCallback, useEffect } from 'react';
import './PhotoUploader.css';
import api from '../api';

const PhotoUploader = ({ adId, initialPhotos = [], onChange }) => {
    const [photos, setPhotos] = useState(initialPhotos);
    const [draggingId, setDraggingId] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!adId) return;
        api.get(`/ads/${adId}/photos`)
            .then(({ data }) => setPhotos(data))
            .catch(err => console.error('Failed to load photos', err));
    }, [adId]);
    const dragItem = useRef(null);

    const uploadFiles = useCallback(async (files) => {
        if (!adId || files.length === 0) return;
        setUploading(true);
        try {
            const uploaded = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await api.post(`/ads/${adId}/photos`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                uploaded.push(data);
            }
            const next = [...photos, ...uploaded];
            setPhotos(next);
            onChange?.(next);
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setUploading(false);
        }
    }, [adId, photos, onChange]);

    const handleFileInput = (e) => {
        uploadFiles(Array.from(e.target.files));
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        uploadFiles(files);
    };

    const handleDelete = async (photoId) => {
        try {
            await api.delete(`/ads/${adId}/photos/${photoId}`);
            const next = photos.filter(p => p.id !== photoId).map((p, i) => ({ ...p, order: i }));
            setPhotos(next);
            onChange?.(next);
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    // Drag-to-reorder
    const handleDragStart = (e, id) => {
        dragItem.current = id;
        setDraggingId(id);
    };

    const handleDragEnter = (e, id) => {
        e.preventDefault();
        setDragOverId(id);
    };

    const handleDragEnd = async () => {
        if (dragItem.current === null || dragOverId === null || dragItem.current === dragOverId) {
            setDraggingId(null);
            setDragOverId(null);
            return;
        }

        const from = photos.findIndex(p => p.id === dragItem.current);
        const to = photos.findIndex(p => p.id === dragOverId);
        const next = [...photos];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        const reordered = next.map((p, i) => ({ ...p, order: i }));

        setPhotos(reordered);
        onChange?.(reordered);
        setDraggingId(null);
        setDragOverId(null);
        dragItem.current = null;

        try {
            await api.patch(`/ads/${adId}/photos/reorder`, reordered.map(p => ({ id: p.id, order: p.order })));
        } catch (err) {
            console.error('Reorder failed', err);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div
                style={{ ...styles.dropzone, ...(isDragOver ? styles.dropzoneActive : {}) }}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <span style={styles.dropzoneText}>
                    {uploading ? 'Загрузка...' : (
                        <>
                            <span style={styles.dropzoneLink}>Выберите файлы</span>
                            {' или перетащите сюда JPG, PNG или GIF до 10 МБ каждый'}
                        </>
                    )}
                </span>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                />
            </div>

            {photos.length > 0 && (
                <div style={styles.grid}>
                    {photos.map((photo, index) => (
                        <div
                            key={photo.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, photo.id)}
                            onDragEnter={(e) => handleDragEnter(e, photo.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnd={handleDragEnd}
                            className="photo-card"
                            style={{
                                ...styles.card,
                                opacity: draggingId === photo.id ? 0.4 : 1,
                                border: dragOverId === photo.id ? '2px dashed #136EF3' : '2px solid transparent',
                            }}
                        >
                            <img src={photo.url} alt="" style={styles.img} draggable={false} />
                            {index === 0 && (
                                <div style={styles.mainBadge}>⭐ Главное фото</div>
                            )}
                            <div className="photo-overlay">
                                <button
                                    className="delete-btn"
                                    onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }}
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
    },
    dropzone: {
        border: '2px dashed #ccc',
        borderRadius: 8,
        padding: '32px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        background: '#fafafa',
    },
    dropzoneActive: {
        borderColor: '#136EF3',
        background: '#EBF3FF',
    },
    dropzoneText: {
        fontSize: 14,
        color: '#555',
    },
    dropzoneLink: {
        color: '#136EF3',
        fontWeight: 600,
        cursor: 'pointer',
    },
    grid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        position: 'relative',
        width: 160,
        height: 120,
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'grab',
        boxSizing: 'border-box',
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    mainBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        background: 'rgba(0,0,0,0.55)',
        color: '#fff',
        fontSize: 11,
        padding: '3px 7px',
        borderRadius: 4,
        pointerEvents: 'none',
    },

};

export default PhotoUploader;
