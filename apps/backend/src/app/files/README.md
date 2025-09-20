# Files Module

A comprehensive file management system using Cloudinary for cloud storage and transformation capabilities.

## Features

- **File Upload**: Upload files to Cloudinary with automatic optimization
- **File Management**: Organize files with folders and tags
- **File Transformations**: Resize, crop, and apply various transformations to images
- **File Search**: Search files by name, tags, type, and other metadata
- **Bulk Operations**: Delete multiple files at once
- **Usage Statistics**: Monitor Cloudinary usage and limits
- **Security**: Role-based access control for file operations

## File Types Supported

- **Images**: JPEG, PNG, GIF, WebP, SVG
- **Videos**: MP4, WebM, QuickTime
- **Documents**: PDF, DOC, DOCX, TXT
- **Audio**: MP3, WAV, AAC, OGG

## API Endpoints

### File Upload
- `POST /files/upload` - Upload a single file
- Supports multipart/form-data with file and optional metadata

### File Management
- `GET /files` - List all files with pagination and filtering
- `GET /files/:id` - Get file details by ID
- `PUT /files/:id` - Update file metadata
- `DELETE /files/:id` - Delete a file
- `POST /files/bulk-delete` - Delete multiple files

### File Transformations
- `POST /files/:id/transform` - Apply transformations to a file
- Supports resizing, cropping, quality adjustment, and more

### Organization
- `GET /files/folders/list` - List all folders
- `GET /files/tags/list` - List all tags
- `GET /files/stats/overview` - Get file statistics

### Cloudinary Integration
- `GET /files/cloudinary/usage` - Get Cloudinary usage statistics
- `GET /files/cloudinary/search` - Search files in Cloudinary

## Environment Variables

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Usage Examples

### Upload a File
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'products');
formData.append('tags', JSON.stringify(['product', 'featured']));

const response = await fetch('/files/upload', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Transform an Image
```typescript
const transformData = {
  transformations: {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto'
  },
  createNew: true
};

const response = await fetch('/files/123/transform', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(transformData)
});
```

### Search Files
```typescript
const query = new URLSearchParams({
  search: 'product',
  type: 'image',
  folder: 'products',
  page: '1',
  limit: '20'
});

const response = await fetch(`/files?${query}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## File Organization

### Folders
Files can be organized into folders for better structure:
- `uploads/` - General uploads
- `products/` - Product images
- `categories/` - Category images
- `users/` - User avatars
- `banners/` - Banner images

### Tags
Files can be tagged for easy categorization:
- `product` - Product-related files
- `featured` - Featured content
- `banner` - Banner images
- `thumbnail` - Thumbnail images
- `gallery` - Gallery images

## Transformations

The module supports various Cloudinary transformations:

### Image Transformations
- **Resize**: `width`, `height`, `crop`
- **Quality**: `quality: 'auto'` for automatic optimization
- **Format**: Convert to different formats
- **Effects**: `radius`, `opacity`, `overlay`, `underlay`
- **Colors**: `color`, `background`, `border`

### Responsive Images
Enable responsive images for automatic generation of multiple sizes:
```typescript
const uploadOptions = {
  responsive: true,
  transformations: {
    width: 800,
    height: 600,
    crop: 'fill'
  }
};
```

## Security

All endpoints are protected with JWT authentication and role-based permissions:

- `files:create` - Upload files
- `files:view` - View files and metadata
- `files:edit` - Update file metadata and transformations
- `files:delete` - Delete files

## Error Handling

The module provides comprehensive error handling:
- File validation (size, type)
- Cloudinary API errors
- Database errors
- Permission errors

## Performance

- Automatic file optimization
- Responsive image generation
- Efficient database queries with pagination
- Cloudinary CDN for fast delivery

## Monitoring

- File upload statistics
- Cloudinary usage monitoring
- Error logging and tracking
- Performance metrics
