/**
 * Converts a user-selected image file into a lightweight Data URL suitable
 * for persisting inside localStorage career saves.
 */
export async function processLogoImageFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selecione um arquivo de imagem válido (PNG, JPG, SVG ou WebP).');
  }

  // Keep small SVGs directly without rasterizing so vector crispness is preserved
  if (file.type === 'image/svg+xml' && file.size <= 150 * 1024) {
    return await readFileAsDataUrl(file);
  }

  const rawDataUrl = await readFileAsDataUrl(file);

  return await new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 256;
      let width = img.naturalWidth || maxDim;
      let height = img.naturalHeight || maxDim;

      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Preserve transparency for PNG/WebP/SVG; compress photos cleanly
      const outputMime =
        file.type === 'image/jpeg' || file.type === 'image/jpg'
          ? 'image/jpeg'
          : 'image/png';
      const result =
        outputMime === 'image/jpeg'
          ? canvas.toDataURL('image/jpeg', 0.88)
          : canvas.toDataURL('image/png');

      resolve(result);
    };
    img.onerror = () => reject(new Error('Não foi possível ler o arquivo de imagem selecionado.'));
    img.src = rawDataUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Falha ao carregar o arquivo.'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo selecionado.'));
    reader.readAsDataURL(file);
  });
}
