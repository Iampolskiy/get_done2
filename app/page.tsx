import Image from "next/image";

export default function Home() {
  return (
    <>
      <div>HI</div>
      <Image
        src="https://res.cloudinary.com/dndjfl94u/image/upload/v1738204893/cld-sample-5.jpg"
        alt="INGAGE"
        width={200}
        height={200}
      />
      <Image
        src="https://res.cloudinary.com/dndvvdmtf/image/upload/v1735946818/test/1/vlrwhhamjxxugcbubvyv.webp"
        alt="INGAGE"
        width={200}
        height={200}
      />
    </>
  );
}
