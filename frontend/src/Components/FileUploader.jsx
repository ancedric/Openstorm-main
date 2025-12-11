import { useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';

const FileUploader = ({ onFileChange }) => {
  // Configurer dropzone pour accepter un seul fichier image
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.svg']
    },
    maxFiles: 1
  });

  const file = acceptedFiles[0];
  
  // Utiliser useMemo pour créer l'URL de l'objet et effectuer le nettoyage (cleanup)
  const preview = useMemo(() => {
    if (file) {
      // Création de l'URL pour la visualisation locale du fichier
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  // Nettoyage de l'URL de l'objet lorsque le composant se démonte ou que le fichier change
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview); // Libère la mémoire
      }
    };
  }, [preview]);

  // Notifier le parent (ShopSetupForm) du fichier sélectionné
  useEffect(() => {
    if (file) {
      onFileChange(file);
    } else {
      onFileChange(null);
    }
  }, [file, onFileChange]);

  // SVG simple pour l'icône de téléversement (remplace l'image placeholder invalide)
  const UploadIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48" className="text-gray-400">
      <path d="M18.784 8.783a.75.75 0 0 0-1.06 0L12 14.506l-5.724-5.723a.75.75 0 1 0-1.06 1.06l6.25 6.25a.75.75 0 0 0 1.06 0l6.25-6.25a.75.75 0 0 0 0-1.06Z" />
      <path d="M12 2a.75.75 0 0 0-.75.75V15h1.5V2.75A.75.75 0 0 0 12 2Z" />
      <path d="M5.75 16.5A.75.75 0 0 0 5 17.25v2.25c0 .414.336.75.75.75h12.5a.75.75 0 0 0 .75-.75v-2.25a.75.75 0 0 0-.75-.75H5.75Z" />
    </svg>
  );

  return (
    <>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} className='dropzone-input' />
        {file ? 
          (
            <>
              <div className="file_uploader-box">
                {file.type.startsWith('image/') && (
                  <img 
                    src={preview} 
                    height={96} 
                    width={96} 
                    alt="Fichier téléversé"
                    className="" // Affichage de la miniature
                  />
                )}
                <p className=''>{file.name}</p>
              </div>
              <p className='file_uploader-label'>Drag another file to replace</p>
            </>
          ) : (
            <div className='file_uploader-box '>
              {UploadIcon}
              <h3 className="file_upload-caption ">Drag image here</h3>
              <p className='file_upload-refs'>SVG, PNG, JPG (Max 1)</p>
              <button 
                className='file_upload-button' 
                type="button" 
                onClick={open}
              >
                {'Select from device'}
              </button>
            </div>
          )}
      </div>
    </>
  );
};

FileUploader.propTypes = {
  onFileChange: PropTypes.func.isRequired,
};

export default FileUploader;
