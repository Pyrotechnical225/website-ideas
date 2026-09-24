# Things That Go! Colouring Book: Amazon KDP upload sheet

Upload two files: **`out/interior.pdf`** (manuscript) and **`out/cover.pdf`** (cover). Copy the rest from this sheet.

## Step 1: Paperback details

| Field | What to enter |
|---|---|
| Language | English |
| Book title | Things That Go! |
| Subtitle | Colouring Book for Toddlers: 30 Big & Simple Vehicles to Colour — Diggers, Tractors, Fire Engines, Trains and More (Ages 2–5) |
| Author | Your name, or a pen name. It must be the same on every book you publish. |
| Description | See below |
| Publishing rights | "I own the copyright and I hold the necessary publishing rights" |
| Primary audience | Sexually explicit content: **No**. Reading age: **2 to 5** |
| Categories | Children's Books → Activities, Crafts & Games → Colouring; Children's Books → Cars, Trains & Things That Go |
| Low-content book | Leave **unticked** (the book has original artwork, so it gets an ISBN) |
| Large print | Leave unticked |

**Keywords** (one per box):
1. toddler colouring book vehicles
2. digger colouring book for kids
3. trucks and tractors colouring book
4. things that go colouring book age 2
5. first colouring book for boys and girls
6. big simple colouring pages preschool
7. fire engine train car colouring gift

**Description** (paste into the description box):

> Vroom vroom! Get ready to colour 30 friendly vehicles with big, simple shapes and thick lines. They're perfect for little hands holding their first crayons.
>
> **Inside you'll find:**
> - Diggers, dump trucks, bulldozers, cement mixers and cranes
> - Fire engines, police cars and ambulances
> - Trains, buses, tractors, taxis and ice cream vans
> - Aeroplanes, helicopters, hot air balloons and a rocket
> - Boats, a submarine, bikes, scooters and more!
>
> **Made for toddlers:**
> - One picture per page, with a blank back so pens don't bleed through
> - Every vehicle is named in big outline letters, so children learn new words while they colour
> - Large 8.5 × 11 inch pages
> - A "This book belongs to" page, a colour-test page and a "Well done!" certificate at the end
>
> A lovely gift for birthdays, Christmas, rainy days and long journeys, for children aged 2 to 5.

## Step 2: Paperback content

| Field | What to enter |
|---|---|
| ISBN | "Get a free KDP ISBN" |
| Print options | **Black & white interior, white paper** |
| Trim size | **8.5 × 11 in** (21.59 × 27.94 cm) |
| Bleed | **No bleed** |
| Paperback cover finish | **Glossy** (brighter colours for a kids' book) |
| Reading direction | Left to right |
| Manuscript | Upload `out/interior.pdf` (64 pages) |
| Cover | "Upload a cover you already have" → `out/cover.pdf` |
| AI-generated content | **Yes** → Images: "Entire work, with minimal or no editing". Text: "Some sections, with minimal or no editing". The pictures and text were created with an AI tool (Claude), so answer honestly. |

Then click **Launch Previewer** and flick through every page before approving.

## Step 3: Rights and pricing

- **Territories:** All territories (worldwide).
- **Marketplace:** Amazon.co.uk (or your main one).
- **Suggested price:** **£5.99**, or $6.99 on Amazon.com. KDP shows the printing cost and your royalty as you type the price. Keep the royalty above about £1.50.
- **Expanded distribution:** optional. It reaches bookshops and libraries, but pays a lower royalty.

## Checks already done on these files

- Interior: 64 pages (even, above the 24-page minimum), every page exactly 8.5 × 11 in, no bleed.
- All artwork sits at least 0.5 in inside the page edge, well within KDP's margins.
- Cover: 17.3941 × 11.25 in = 0.125 in bleed + 8.5 in back + 0.1441 in spine (64 pages × 0.002252 in, white paper) + 8.5 in front + 0.125 in bleed. This matches KDP's cover calculator for this setup.
- There's no spine text: KDP only allows it on books over 79 pages.
- The bottom-right of the back cover is left clear for the barcode KDP adds.
- The PDFs contain **no fonts** (all lettering is drawn as shapes), so nothing can be "not embedded".
- All artwork is original: no brands, logos or existing characters. The lettering font is Fredoka, which is licensed for commercial use (SIL Open Font Licence, `fonts/fredoka-LICENSE`).

**Remember:** if you change the page count or paper type, the spine width changes, so the cover must be rebuilt (`npm run build`).
