// Date helper utilities
export const formatISODate = (iso?: string | null) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
};

export const nowISO = () => new Date().toISOString();
