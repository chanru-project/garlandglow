import { createFileRoute } from "@tanstack/react-router";
import { IMAGES } from "@/data/products";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Malligai — Our Story | Garlands & Flowers" },
      { name: "description", content: "Three generations of master florists crafting fresh garlands and flowers for Chennai's families." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-xs uppercase tracking-[0.3em] text-accent">Our story</div>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">welcome to DUVIX flowers & events!</h1>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <img src={IMAGES.heroImg} alt="Malligai florists" className="rounded-2xl object-cover shadow-elegant" />
        <div className="space-y-4 text-foreground/85">
          <p>Welcome to DUVIX Flowers & Events, your trusted destination for premium flowers, elegant event décor, and complete event management services.  DUVIX is proudly based in Dindigul and serves customers across Dindigul, Madurai, and surrounding areas.

We specialize in delivering fresh flowers, handcrafted wedding and ceremonial garlands, stunning stage decorations, professional DJ and sound systems, creative lighting, balloon decorations, and end-to-end event planning for every occasion. Whether you're celebrating a wedding, engagement, birthday, housewarming, corporate event, or any special function, our experienced team is dedicated to creating unforgettable experiences with exceptional quality and attention to detail.

At DUVIX Flowers & Events, customer satisfaction is at the heart of everything we do. We combine creativity, reliability, and timely service to ensure every celebration is beautifully planned and flawlessly executed.</p>
          <p>DUVIX Flowers & Events-க்கு உங்களை அன்புடன் வரவேற்கிறோம்!**

DUVIX Flowers & Events என்பது தரமான மலர்கள், அழகிய நிகழ்ச்சி அலங்காரங்கள் மற்றும் முழுமையான Event Management சேவைகளை வழங்கும் உங்கள் நம்பகமான நிறுவனமாகும். எங்கள் நிறுவனம் **திண்டுக்கல்** நகரை தலைமையிடமாகக் கொண்டு செயல்பட்டு, **திண்டுக்கல், மதுரை மற்றும் சுற்றுவட்டார பகுதிகளில்** உள்ள வாடிக்கையாளர்களுக்கு சிறந்த சேவைகளை வழங்கி வருகிறது.

புதிய மற்றும் மணம் மிக்க மலர்கள், கைவினைத் திறனுடன் தயாரிக்கப்படும் திருமண மற்றும் விழா மாலைகள், கண்கவர் மேடை அலங்காரங்கள், நவீன DJ & Sound System, பிரமாண்டமான Lighting அமைப்புகள், Balloon Decoration மற்றும் அனைத்து வகையான விழாக்களுக்கும் முழுமையான Event Planning & Management சேவைகளை நாங்கள் வழங்குகிறோம்.

திருமணம், நிச்சயதார்த்தம், பிறந்தநாள் விழா, புதுமனை புகுவிழா, நிறுவன நிகழ்ச்சிகள் அல்லது எந்தவொரு சிறப்பு நிகழ்வாக இருந்தாலும், உங்கள் விழாவை அழகாகவும், சிறப்பாகவும், மறக்க முடியாத அனுபவமாகவும் மாற்ற எங்கள் அனுபவமிக்க குழு முழு அர்ப்பணிப்புடன் செயல்படுகிறது.

**DUVIX Flowers & Events-இல், வாடிக்கையாளர் திருப்தியே எங்களின் முதல் முன்னுரிமை. தரம், படைப்பாற்றல், நம்பகத்தன்மை மற்றும் சரியான நேரத்தில் சேவை வழங்குவதன் மூலம், உங்கள் ஒவ்வொரு கொண்டாட்டத்தையும் சிறப்பாகவும் குறையற்ற முறையிலும் நடத்த உறுதியளிக்கிறோம்.
</p>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { n: "New", l: "Trusted Brand" },
          { n: "Fresh", l: "Flower Collections" },
          { n: "Available", l: "Across Dindigul & Madurai" },
        ].map((s) => (
          <div key={s.n} className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
            <div className="font-display text-5xl text-gradient-gold">{s.n}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
