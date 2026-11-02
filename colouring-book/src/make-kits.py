# Writes the parent READ ME and the campaign kit for each book's free sample pack, then zips them all.
import os, zipfile
BOOKS = [
  dict(slug='my-first-christmas', title='My First Christmas', theme='Christmas', emoji='🎄',
       five='Father Christmas, a snowman, a reindeer, a Christmas tree and a gingerbread man',
       more='from presents and penguins to a gingerbread house', search='My First Christmas Colouring Book for Toddlers'),
  dict(slug='dino-friends', title='Dino Friends!', theme='Dinosaur', emoji='🦖',
       five='a T-Rex, a Triceratops, a Stegosaurus, a hatching egg and a Brachiosaurus',
       more='from a Pterodactyl to a dino birthday party', search='Dino Friends Dinosaur Colouring Book for Toddlers'),
  dict(slug='moo-oink-baa', title='Moo! Oink! Baa!', theme='Farm Animal', emoji='🐮',
       five='a cow, a pig, a sheep, a duck and the big red barn',
       more='hens, horses, a tractor and a frog, and each animal says its sound', search='Moo Oink Baa Farm Animals Colouring Book for Toddlers'),
  dict(slug='things-that-go', title='Things That Go!', theme='Vehicle', emoji='🚒',
       five='a fire engine, a digger, a double-decker bus, a tractor and a steam train',
       more='from rockets and helicopters to an ice cream van', search='Things That Go Colouring Book for Toddlers'),
]
for b in BOOKS:
    b['folder'] = f"FREE {b['theme']} Colouring Pages for Toddlers (Printable PDF)"
    d = f"marketing/{b['slug']}"
    for f in os.listdir(d):
        if f.startswith('_preview') or f.startswith('2 - READ ME'): os.remove(os.path.join(d, f))
    open(f"{d}/2 - READ ME - How to Print + Get the Full 30-Page Book.txt", 'w').write(f"""FREE {b['theme'].upper()} COLOURING PAGES FOR TODDLERS
From the book "{b['title']}" - Colouring Book for Toddlers (ages 2-5)
===================================================================

In this folder:
  1 - ... A4 (UK & Europe).pdf  and  1 - ... US Letter.pdf
      The same 5 pages in two paper sizes. Pick the one for your printer.
  3 - Preview - Full Book Cover.png
      What the full book looks like.

What's inside: {b['five']}.
Big shapes and thick lines for little hands.

Printing tips
  * Print one-sided, "Fit to page".
  * Thicker paper (or card behind the page) stops pens showing through.

Free to print for your own children, classroom, nursery or homeschool group.
Please don't sell the pages or share them as your own.

Want more? The full book has 30 pictures, {b['more']}.
  Amazon: [PASTE YOUR AMAZON LINK HERE]
  Or search Amazon for: {b['search']}
""")
    kit = f"""# {b['title']}: free sample campaign kit

Replace [DRIVE LINK] and [AMAZON LINK] before using. Only post once the book is live on Amazon.

## Google Drive
- Folder name: **{b['folder']}**
- Upload the 4 files from this folder. Put your Amazon link in the READ ME first.
- Share: Anyone with the link → Viewer. Test it in a private (incognito) window.

## Facebook group post
{b['emoji']} **Free {b['theme'].lower()} colouring pages for toddlers (2–5)**

5 printable pages: {b['five']}. Big shapes, thick lines. A4 and US Letter, no sign-up:
[DRIVE LINK]

I'm the creator. They're a sample from my 30-page book, linked on the last page, but the free pages are yours to keep either way.

## Reddit post
**Title:** [Free printable] 5 big, simple {b['theme'].lower()} colouring pages for toddlers 2–5 (creator here)

5 pages: {b['five']}. Thick lines, one picture per page, A4 and US Letter, no sign-up: [DRIVE LINK]

Disclosure: I made these. They're from my 30-page book on Amazon (linked on the last page). Mods, please remove if this breaks the rules.

## Homeschool forum post
**Free {b['theme'].lower()} colouring printables for ages 2–5**

5 pages ({b['five']}) with big shapes and thick outlines, each picture named in outline letters. Good for grip practice, colour names, counting and first letters.
Free download, no sign-up: [DRIVE LINK]

I'm the creator. Full book: "{b['title']}" ([AMAZON LINK]).

## Influencer message
I've published a toddler colouring book (ages 2–5): "{b['title']}", 30 big, simple {b['theme'].lower()} pictures.
Would you like the full PDF free for your kids? No obligation. If you do share it, please mark it #gifted.
Free 5-page sample: [DRIVE LINK]

Never offer a free copy in exchange for an Amazon review. Amazon bans this.
"""
    open(f"marketing/MARKETING-KIT-{b['slug']}.md", 'w').write(kit)

zp = 'marketing/FREE-Sample-Packs - all 4 books.zip'
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('00 READ ME FIRST.txt', """FREE SAMPLE PACKS - 4 BOOKS
Each "FREE ... (Printable PDF)" folder is ready to upload to Google Drive as it is.
Before uploading, open its READ ME and paste in that book's Amazon link.
The "Campaign kits (for you)" folder holds the posts and messages. Don't upload those.
""")
    for b in BOOKS:
        d = f"marketing/{b['slug']}"
        for f in sorted(os.listdir(d)): z.write(os.path.join(d, f), f"{b['folder']}/{f}")
        z.write(f"marketing/MARKETING-KIT-{b['slug']}.md", f"Campaign kits (for you)/{b['title'].replace('!','').replace('?','')} - posts and messages.md")
with zipfile.ZipFile(zp) as z:
    print(z.testzip() or 'zip OK')
    for i in z.infolist(): print(i.filename)
