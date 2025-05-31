const formatDate = (isoString: string) => {
  const cleaned = isoString.split(".")[0]; // Remove microseconds
  const date = new Date(cleaned);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export { formatDate };
