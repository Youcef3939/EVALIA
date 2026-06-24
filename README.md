# EVALIA

**EVALIA** is an ai powered pitch deck evaluation system designed to simulate how investors analyze early stage startups
it transforms raw pitch decks into structured, investor style feedback focused on clarity, storytelling, and investment potential

## objective

the goal is not to just generate feedback on pitch decks, but to simulate how an AI system can evaluate startups from an investor's perspective focusing on
- clarity of communication
- narrative structure and storytelling
- problem-solution fit and venture potential 

the system produces structured, decision oriented feedback reflecting real world investment thinking

## core product concept

EVALIA analyzes pitch decks and outputs a structured evaluation highlighting:
- key strengths
- key weaknesses
- investor oriented insights and risks

the evaluation is designed to reflect how early stage venture investors assess startups under uncertainty

## evaluation framework

EVALIA is structured around 3 core dimensions:

### 1. investor communication & deck clarity:
this dimension evaluates how clearly and effectively the pitch deck communicates ideas in an investor ready format
the system assesses:
- grammar, spelling, and linguistic clarity
- ambiguous, unclear, or poorly structured messaging
- overly dense or complex explanations
- information overload on slides
- redundant or unfocused content

the goal here is to ensure the deck is clear, concise, and presentation ready for investors

### 2. narrative & founder storytelling
this dimension evaluates whether the pitch deck follows a coherent and persuasive startup narrative

expected structure:
**cover -> problem -> solution -> product -> market opportunity -> business model -> traction -> go to market strategy -> team -> ask**

the system assesses:
- whether the story follows a logical progression
- whether sections connect and reinforce each other
- whether key narrative components are missing or weak
- whether the overall flow builds a convincing investment case

the goal here is to evaluate whether the deck tells a fundable and structured startup story

### 3. problem solution fit
this is the core investment validation layer

the system identifies:
- the core problem being adressed
- the proposed solution
- the casual relationship between them

it evaluates:
- whether the problem is clearly defined and meaningful
- whether it reflects a real, frequent, or high impact pain point
- whether the solution directly adresses the problem

the goal here is to validate whether the startup solves a real, scalable, and meaningful problem

## MVP system design

this project follows a simple but functional pipeline

1. input: pitch deck ( PDF or structured text )
2. extraction : convert slides into structured text format
3. analysis : apply investor inspired evaluation framework
4. output : structured investor report including strengths, weaknesses, risks and insights

## trade offs

1. simplicity vs advanced multimodal understanding: i prioritized text based analysis over visual understanding ( charts, images, layouts ) to ensure a functional MVP within limited time

2. structured reasoning vs end to end ML training: instead of training a dedicated evaluation model, i used a prompt driven reasoning system with a structured rubric to simulate investor judgment efficently

3. explainibility vs model complexity: i chose a rule guided evaluation framework over a black box scoring model to ensure interpretability of results for users

## important

if you hit the daily limit on the groq api key, feel free to make a new file **.env.local** in the root folder and put your own groq api key and they **npm run dev** and start **evalia**!
