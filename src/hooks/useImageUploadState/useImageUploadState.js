import { useCallback, useEffect, useMemo, useState } from 'react';

const useImageUploadState = (inputRef, props = {}) => {
  const {
    previewImage: existingImage,
    defaultPreviewImage: defaultPreviewNode,
    fileTypes,
    onChange,
    previewHeight,
    previewWidth,
  } = props;

  const defaultPreviewImage = useMemo(
    () => (typeof defaultPreviewNode === 'string'
      ? defaultPreviewNode
      : null),
    [defaultPreviewNode],
  );

  const [previewImage, setPreviewImage] = useState(existingImage || defaultPreviewImage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isImageType, setIsImageType] = useState(true);
  const [fileName, setFileName] = useState('');

  useEffect(
    () => setPreviewImage(existingImage || defaultPreviewImage),
    [existingImage, defaultPreviewImage],
  );

  const pressPreviewButton = useCallback(() => {
    if (previewImage && previewImage !== defaultPreviewImage) {
      setIsMenuOpen(true);
    } else {
      inputRef.current.click();
    }
  }, [defaultPreviewImage, previewImage, inputRef]);

  const handleInputChange = useCallback(event => {
    const eventFileType = event.target?.files[0]?.type?.split('/')[0];
    if (fileTypes?.includes(eventFileType)) {
      if (onChange && typeof onChange === 'function') {
        onChange(event);
      }

      // If existing image is not undefined, we rely on consumers to handle this themselves.
      if (existingImage === undefined) {
        if (eventFileType === 'image') {
          setIsImageType(true);

          const reader = new FileReader();
          reader.onload = ({ target: { result } }) => {
            setPreviewImage(result);
          };
          reader.readAsDataURL(event.target?.files[0]);
        } else {
          setIsImageType(false);
          setFileName(event.target?.files[0]?.name);
        }
      }
    }
  }, []);

  const handleOpenMenuChange = useCallback(
    isOpen => {
      if (isOpen && previewImage && previewImage !== defaultPreviewImage) {
        setIsMenuOpen(true);
      } else {
        setIsMenuOpen(false);
      }
    },
    [defaultPreviewImage, previewImage],
  );

  const removePreview = useCallback(
    () => setPreviewImage(defaultPreviewImage),
    [defaultPreviewImage],
  );

  const showFileDialog = useCallback(() => inputRef?.current?.click(), [
    inputRef,
  ]);

  const handleLabelClick = useCallback(
    e => {
      e.preventDefault();
      if (previewImage && previewImage !== defaultPreviewImage) {
        setIsMenuOpen(true);
      } else {
        showFileDialog();
      }
    },
    [previewImage, defaultPreviewImage],
  );

  const widthHeightSx = useMemo(
    () => ({
      height: previewHeight,
      width: previewWidth,
    }),
    [previewHeight, previewWidth],
  );

  return {
    defaultPreviewImage,
    defaultPreviewNode,
    fileName,
    handleInputChange,
    handleLabelClick,
    handleOpenMenuChange,
    isImageType,
    isMenuOpen,
    pressPreviewButton,
    previewImage,
    removePreview,
    showFileDialog,
    widthHeightSx,
  };
};

export default useImageUploadState;
