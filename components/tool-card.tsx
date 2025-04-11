export const ToolCard = ({ image, alt }) => (
  <div className="mx-4 flex h-20 items-center justify-center rounded-lg bg-slate-700">
    <img src={image || "/placeholder.svg"} alt={alt} className="max-h-20 w-auto object-contain" />
  </div>
)
