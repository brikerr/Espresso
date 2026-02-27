#!/usr/bin/env node
// Generate narration audio files via ElevenLabs TTS API.
// Usage: ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... node scripts/generate-audio.js

var https = require('https');
var fs = require('fs');
var path = require('path');

var API_KEY = process.env.ELEVENLABS_API_KEY;
var VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

if (!API_KEY || !VOICE_ID) {
  console.error('Error: Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID environment variables.');
  process.exit(1);
}

var OUTPUT_DIR = path.join(__dirname, '..', 'audio');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

var chapters = [
  {
    id: '01-overview',
    text: "Every espresso shot extracts over a thousand compounds in a precise sequence. Bright acids dissolve first, then sugars and caramels, and finally bitter tannins. Understanding this sequence is the key to dialing in flavor. Each colored layer in this visualization represents a different aspect of extraction, and together they reveal why your shot tastes the way it does."
  },
  {
    id: '02-phases',
    text: "The extraction divides into three phases. Phase one extracts bright fruit acids — citric, malic, phosphoric. These dissolve fastest and set the brightness of the cup. Phase two is the sweet spot where sugars, melanoidins, and caramel compounds peak. This is where most of the flavor complexity lives. Phase three brings caffeine, tannins, and astringent polyphenols. The goal is to maximize phase two while keeping phase three in check."
  },
  {
    id: '03-brew-methods',
    text: "Switching brew methods completely reshapes the extraction curve. Espresso uses nine bars of pressure for a twenty-five second shot at ten percent total dissolved solids. Pour-over relies on gravity over three and a half minutes, producing a much more dilute one-point-three percent TDS. AeroPress sits in between with hand-driven pressure, and French press uses full immersion with a metal mesh that lets oils through for a heavier body. Each method trades off concentration, clarity, and body differently."
  },
  {
    id: '04-temperature',
    text: "Brew water temperature drives extraction speed. At ninety-three degrees Celsius, water at the center of the puck dissolves compounds aggressively. Temperature drops as water flows outward through the grounds, creating the gradient you see here. These dashed contour rings show the ninety-three, ninety, and eighty-five degree isotherms. Too hot and you over-extract into bitterness. Too cool and you under-extract, leaving a sour, thin shot. Most espresso machines target ninety to ninety-four degrees."
  },
  {
    id: '05-pressure-crema',
    text: "Nine bars of pressure — about a hundred and thirty PSI — force water through the finely ground coffee puck. That pressure creates the copper-toned gradient you see radiating outward. It also emulsifies carbon dioxide and lipids into crema — the golden-brown foam layer expanding and pulsing at the center. Crema is unique to espresso and indicates both freshness and proper extraction. Stale beans produce thin, pale crema. Fresh beans produce thick, tiger-striped foam."
  },
  {
    id: '06-problems',
    text: "Two common problems show up in the visualization. Channeling happens when water finds cracks or weak spots in the coffee puck and rushes through them, over-extracting those narrow paths while leaving surrounding coffee under-extracted. You can see these as irregular lines radiating outward. On the opposite side, resistance zones form where the puck is compacted too tightly — from uneven tamping or clumps in the grounds. These zones choke the flow, causing dry spots and bitter patches."
  },
  {
    id: '07-dialing-in',
    text: "Dialing in means adjusting grind size to control extraction. Watch what happens as we change the grind. Fine grinds create more resistance and higher channeling risk, but extract more flavor compounds. The phases compress toward the center. Coarser grinds let water flow freely with almost no channeling, but risk under-extraction — the phases spread wide. Medium-fine is the sweet spot for most espresso, balancing extraction completeness with flow evenness. Start there, then adjust finer if the shot tastes sour, or coarser if it tastes bitter."
  }
];

function generateChapter(index) {
  if (index >= chapters.length) {
    console.log('\nAll chapters generated successfully.');
    return;
  }

  var chapter = chapters[index];
  var outFile = path.join(OUTPUT_DIR, chapter.id + '.mp3');
  console.log('Generating ' + chapter.id + '...');

  var postData = JSON.stringify({
    text: chapter.text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true
    }
  });

  var options = {
    hostname: 'api.elevenlabs.io',
    port: 443,
    path: '/v1/text-to-speech/' + VOICE_ID,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY,
      'Accept': 'audio/mpeg'
    }
  };

  var req = https.request(options, function(res) {
    if (res.statusCode !== 200) {
      var body = '';
      res.on('data', function(d) { body += d; });
      res.on('end', function() {
        console.error('  Error ' + res.statusCode + ' for ' + chapter.id + ': ' + body);
        generateChapter(index + 1);
      });
      return;
    }

    var file = fs.createWriteStream(outFile);
    res.pipe(file);
    file.on('finish', function() {
      file.close();
      var size = fs.statSync(outFile).size;
      console.log('  Saved ' + outFile + ' (' + Math.round(size / 1024) + ' KB)');
      setTimeout(function() { generateChapter(index + 1); }, 1000);
    });
  });

  req.on('error', function(e) {
    console.error('  Request error for ' + chapter.id + ': ' + e.message);
    generateChapter(index + 1);
  });

  req.write(postData);
  req.end();
}

console.log('ElevenLabs TTS Audio Generator — Espresso Extraction Anatomy');
console.log('Voice ID: ' + VOICE_ID);
console.log('Output: ' + OUTPUT_DIR);
console.log('---');
generateChapter(0);
