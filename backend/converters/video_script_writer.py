"""
AI Video Script Writer Converter
Generates professional video scripts using Google Gemini API
"""

import google.generativeai as genai
from typing import Dict, Any
import os

# Configure Google Gemini API
GOOGLE_API_KEY = "AIzaSyB2klA37dXr37gUebpeox5Z2sHoEKuJFwY"
genai.configure(api_key=GOOGLE_API_KEY)

class VideoScriptWriter:
    """Handles AI-powered video script generation"""

    TONE_STYLES = {
        "professional": "Formal language, data-driven, authoritative tone with industry expertise",
        "casual": "Friendly, relatable, conversational style that feels like talking to a friend",
        "humorous": "Jokes, puns, light-hearted approach with comedic timing and wit",
        "educational": "Step-by-step, clear explanations with teaching methodology and examples",
        "motivational": "Inspiring, energetic, empowering language that drives action",
        "storytelling": "Narrative structure with emotional connection and compelling arcs"
    }

    PLATFORM_SPECS = {
        "youtube": {
            "style": "Longer form, detailed content, SEO-focused with retention hooks",
            "engagement": "Like, subscribe, bell icon reminders",
            "length_modifier": 1.0
        },
        "instagram": {
            "style": "Short, punchy, trend-aware with visual focus",
            "engagement": "Follow, share to stories, save post",
            "length_modifier": 0.6
        },
        "tiktok": {
            "style": "Ultra-short, hook-first, trend-driven with quick pacing",
            "engagement": "Follow, like, share, duet",
            "length_modifier": 0.5
        },
        "facebook": {
            "style": "Community-focused, shareable, discussion-oriented",
            "engagement": "Like, share, comment your thoughts",
            "length_modifier": 0.8
        },
        "linkedin": {
            "style": "Professional, value-driven, industry insights with thought leadership",
            "engagement": "Connect, follow, share with network",
            "length_modifier": 0.9
        }
    }

    def __init__(self):
        """Initialize the video script writer with Gemini 1.5 Flash model"""
        self.model = genai.GenerativeModel('gemini-flash-latest')

    def generate_script(self,
                       topic: str,
                       duration: int,
                       tone: str,
                       platform: str) -> Dict[str, Any]:
        """
        Generate a professional video script based on parameters

        Args:
            topic: Video topic/subject
            duration: Duration in minutes
            tone: Tone style (professional, casual, humorous, etc.)
            platform: Target platform (YouTube, Instagram, TikTok, etc.)

        Returns:
            Dictionary containing the generated script and metadata
        """

        # Normalize inputs
        tone = tone.lower()
        platform = platform.lower()

        # Get tone and platform specifications
        tone_description = self.TONE_STYLES.get(tone, self.TONE_STYLES["professional"])
        platform_spec = self.PLATFORM_SPECS.get(platform, self.PLATFORM_SPECS["youtube"])

        # Adjust duration based on platform
        adjusted_duration = int(duration * platform_spec["length_modifier"])

        # Create professional Hollywood-style column format prompt
        prompt = f"""You are an elite Hollywood-level Video Script Writer. Create a broadcast-quality script in PROFESSIONAL COLUMN FORMAT.

**TOPIC:** {topic}
**DURATION:** {adjusted_duration} minutes
**TONE:** {tone} ({tone_description})
**PLATFORM:** {platform.upper()}

Generate a complete production-ready script with this EXACT structure:

═══════════════════════════════════════════════════

# VIDEO SCRIPT: {topic}

## PROJECT METADATA

| Field | Details |
|:------|:--------|
| **Project Title** | [Catchy professional title] |
| **Duration** | {adjusted_duration}:00 minutes |
| **Platform** | {platform.upper()} |
| **Tone** | {tone.title()} |
| **Script Version** | v1.0 |

---

## VIDEO TITLE OPTIONS
1. [SEO optimized title]
2. [Curiosity-driven title]
3. [Direct approach title]

---

## THUMBNAIL STRATEGY

| Element | Specification |
|:--------|:--------------|
| **Color Palette** | [Colors that pop] |
| **Text Overlay** | "[2-4 word phrase]" |
| **Visual Elements** | [What to show] |
| **Emoji** | [3-5 emojis] |

---

## SEO PACKAGE

**Keywords:** [8-10 keywords separated by commas]

**Hashtags:** #[tag1] #[tag2] #[tag3] #[tag4] #[tag5]

---

# THE SCRIPT - PROFESSIONAL COLUMN FORMAT

## ACT 1: HOOK & INTRODUCTION

### SCENE 1: COLD OPEN [0:00-0:08]

| TIMECODE | AUDIO/DIALOGUE | VIDEO/VISUAL | GRAPHICS | MUSIC/SFX | NOTES |
|:---------|:---------------|:-------------|:---------|:----------|:------|
| 00:00 | [Powerful opening statement] | SHOT: [Wide/Medium/Close]<br>CAMERA: [Movement]<br>LOCATION: [Setting] | LOWER THIRD:<br>[Channel name] | MUSIC: [Type]<br>Energy: High<br>SFX: [Sound] | [Direction for host/editor] |
| 00:03 | [Emphasis statement]<br>**[PAUSE]** | SHOT: [Angle change]<br>ACTION: [What happens] | TEXT:<br>[Key phrase] | MUSIC: [Beat drop]<br>SFX: [Effect] | PACING: Fast cuts |

---

### SCENE 2: INTRODUCTION [0:08-0:35]

| TIMECODE | AUDIO/DIALOGUE | VIDEO/VISUAL | GRAPHICS | MUSIC/SFX | NOTES |
|:---------|:---------------|:-------------|:---------|:----------|:------|
| 00:08 | "Welcome! Today we're [promise]" | SHOT: Medium<br>FRAMING: Rule of thirds<br>HOST: Centered | LOWER THIRD:<br>Host name<br>SUBSCRIBE:<br>Animated | MUSIC: Medium energy<br>Volume: 30% | Eye contact<br>Confident |
| 00:15 | "[Problem]. I'll show you [solution]" | B-ROLL:<br>• [Shot 1]<br>• [Shot 2]<br>• [Shot 3] | TEXT:<br>"What We Cover:"<br>✓ [Point 1]<br>✓ [Point 2]<br>✓ [Point 3] | MUSIC: Consistent | 3-sec cutaways |
| 00:25 | "Subscribe for more [content type]" | ACTION: Gestures to button<br>GRAPHICS: Bell bounce | ANIMATED:<br>Like+Sub+Bell<br>Pulses 3 sec | SFX: Bell ding | Call to action |

---

## ACT 2: MAIN CONTENT

### SCENE 3: MAIN POINT 1 [{topic} aspect] [0:35-1:15]

| TIMECODE | AUDIO/DIALOGUE | VIDEO/VISUAL | GRAPHICS | MUSIC/SFX | NOTES |
|:---------|:---------------|:-------------|:---------|:----------|:------|
| 00:35 | "First: [specific point]. Here's why..." | TRANSITION: Wipe<br>SHOT: [New angle] | TITLE:<br>"Part 1: [Name]"<br>2-sec display | MUSIC: Shift tone | Chapter marker |
| 00:42 | "[Detailed explanation]"<br>**[PAUSE]**<br>"Let me show you..." | A-ROLL: Host<br>B-ROLL:<br>1. Close-up<br>2. Wide shot<br>3. Detail shot | DATA:<br>[Visual/chart]<br>CALLOUT:<br>"Key: [Fact]" | MUSIC: 20% vol<br>SFX: [Demo sound] | Macro lens<br>Match cut |

---

### SCENE 4: MAIN POINT 2 [Next aspect] [1:15-1:55]

| TIMECODE | AUDIO/DIALOGUE | VIDEO/VISUAL | GRAPHICS | MUSIC/SFX | NOTES |
|:---------|:---------------|:-------------|:---------|:----------|:------|
| 01:15 | "Now here's the interesting part..." | TRANSITION: Dynamic<br>NEW ANGLE: Fresh view | TITLE:<br>"Part 2: [Name]"<br>New color | MUSIC: Variation | Pattern interrupt |
| 01:22 | "[Second point details]"<br>**[PAUSE]**<br>"See the difference?" | COMPARISON:<br>Side-by-side<br>B-ROLL:<br>• Option A<br>• Option B | SPLIT SCREEN:<br>Left vs Right<br>VS graphic<br>Pros/Cons | SFX: Versus<br>MUSIC: Build | Contrasting colors |

---

### SCENE 5: MAIN POINT 3 [Final aspect] [1:55-2:30]

| TIMECODE | AUDIO/DIALOGUE | VIDEO/VISUAL | GRAPHICS | MUSIC/SFX | NOTES |
|:---------|:---------------|:-------------|:---------|:----------|:------|
| 01:55 | "Finally, the most important part..." | SHOT: [Emphasis angle] | TITLE:<br>"Part 3: [Name]" | MUSIC: Peak energy | Climax build |
| 02:05 | "[Final key information]" | DEMO: [Action]<br>B-ROLL: [Results] | HIGHLIGHT:<br>[Key takeaway] | SFX: [Impact] | Strong conclusion |

---

## ACT 3: ENGAGEMENT & CLOSE

### SCENE 6: AUDIENCE ENGAGEMENT [2:30-2:45]

| TIMECODE | AUDIO/DIALOGUE | VIDEO/VISUAL | GRAPHICS | MUSIC/SFX | NOTES |
|:---------|:---------------|:-------------|:---------|:----------|:------|
| 02:30 | "My question: [engaging question]<br>Comment below!" | SHOT: Direct address<br>ACTION: Points down | ANIMATED:<br>"💬 COMMENT"<br>Arrow down | MUSIC: Uplifting<br>Energy up | Spark discussion |

---

### SCENE 7: OUTRO [2:45-END]

| TIMECODE | AUDIO/DIALOGUE | VIDEO/VISUAL | GRAPHICS | MUSIC/SFX | NOTES |
|:---------|:---------------|:-------------|:---------|:----------|:------|
| 02:45 | "Smash Like if this helped!" | Gesture to button | LIKE animation<br>Pulses | SFX: Click sound | Explain benefit |
| 02:50 | "Subscribe for [next topic tease]" | B-ROLL: Teaser clips | SUBSCRIBE:<br>Button+Bell<br>NEXT: Preview | MUSIC: Build | Create FOMO |
| 02:55 | "Thanks! I'm [Name]. [Sign-off]!" | Wave/gesture<br>Fade out | END SCREEN:<br>Thumbnails<br>Subscribe<br>Socials | MUSIC: Peak<br>Fade 2 sec | Brand consistency |

═══════════════════════════════════════════════════

Generate professional, broadcast-quality script following this EXACT table format. Make it {tone} for {platform}. {adjusted_duration} min total."""

        try:
            # Generate script using Gemini with faster configuration
            generation_config = {
                "temperature": 1.0,  # Higher for faster, more creative output
                "top_p": 1.0,  # Maximum sampling for speed
                "top_k": 64,  # Increased for faster generation
                "max_output_tokens": 1500,  # Reduced for faster generation (10-20 sec target)
                "candidate_count": 1,  # Single candidate for speed
            }

            response = self.model.generate_content(
                prompt,
                generation_config=generation_config
            )
            script_text = response.text

            # Calculate estimated word count
            word_count = len(script_text.split())

            # Extract thumbnail and SEO info from the main script (already included in prompt)
            thumbnail_ideas = "**Thumbnail Ideas:**\n- Bold text with main topic\n- Eye-catching colors matching your brand\n- Include emoji or icon related to topic\n- Show emotion or result\n- Use high contrast for readability"

            seo_keywords = f"**SEO Keywords for '{topic}':**\n{topic.lower()}, video script, {platform} video, content creation, {tone} content, video marketing, social media content"

            return {
                "success": True,
                "script": script_text,
                "metadata": {
                    "topic": topic,
                    "duration": adjusted_duration,
                    "original_duration": duration,
                    "tone": tone,
                    "platform": platform,
                    "word_count": word_count,
                    "estimated_speaking_time": f"{adjusted_duration} minutes",
                    "thumbnail_ideas": thumbnail_ideas,
                    "seo_keywords": seo_keywords
                }
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to generate script: {str(e)}",
                "script": None,
                "metadata": None
            }

    def refine_script(self, original_script: str, refinement_request: str) -> Dict[str, Any]:
        """
        Refine or modify an existing script based on user feedback

        Args:
            original_script: The original script text
            refinement_request: What to change or improve

        Returns:
            Dictionary with refined script
        """

        prompt = f"""You are a professional video script editor. Here's the original script:

{original_script}

REFINEMENT REQUEST: {refinement_request}

Please refine the script according to the request while maintaining:
- Professional structure
- Visual and music cues
- Timestamps
- Engaging tone
- Platform optimization

Provide the complete refined script."""

        try:
            response = self.model.generate_content(prompt)

            return {
                "success": True,
                "refined_script": response.text,
                "refinement_applied": refinement_request
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to refine script: {str(e)}"
            }


def generate_video_script(topic: str,
                         duration: int,
                         tone: str,
                         platform: str) -> Dict[str, Any]:
    """
    Main function to generate video script

    Args:
        topic: Video topic/subject
        duration: Duration in minutes
        tone: Tone style
        platform: Target platform

    Returns:
        Dictionary containing script and metadata
    """
    writer = VideoScriptWriter()
    return writer.generate_script(topic, duration, tone, platform)


def refine_video_script(original_script: str,
                       refinement_request: str) -> Dict[str, Any]:
    """
    Refine an existing video script

    Args:
        original_script: Original script text
        refinement_request: Changes to make

    Returns:
        Dictionary with refined script
    """
    writer = VideoScriptWriter()
    return writer.refine_script(original_script, refinement_request)
