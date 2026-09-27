import { Poster } from "./Poster"
import { posters } from "./posters"
import { WallGL } from "./WallGL"

export function Wall() {
  return (
    <section className="wall" data-wall aria-label="Every project, pasted on one wall">
      <div className="wall__stage">
        {posters.map((spec, i) => (
          <Poster key={spec.id} spec={spec} index={i} />
        ))}
      </div>
      <p className="wall__stencil" aria-hidden="true">
        Post no bills
      </p>
      <WallGL />
    </section>
  )
}
