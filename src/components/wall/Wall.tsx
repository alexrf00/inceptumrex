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
      {/* Shown by the WebGL wall once a bill has been torn off. */}
      <button type="button" className="wall__repaste" data-repaste hidden>
        Paste the bills back
      </button>
      <WallGL />
    </section>
  )
}
