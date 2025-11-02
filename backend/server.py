import os
import json
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Gemini API Configuration ---
try:
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
except (ValueError, KeyError) as e:
    print(f"Error configuring Gemini API: {e}")
    # We will let it proceed, but API calls will fail.
    pass

def create_recommendation_prompt(skills_data):
    """
    Creates a detailed prompt for the Gemini model to generate career recommendations.
    """
    skills_summary = []
    for category in skills_data:
        cat_skills = []
        for skill in category['skills']:
            cat_skills.append(f"{skill['name']} (Level: {skill['level']}/10)")
        skills_summary.append(f"  - {category['category']}: {', '.join(cat_skills)}")

    prompt = f"""You are an expert career advisor AI for the Indian job market. Your task is to generate personalized career recommendations based on a user's self-assessed skills.

Analyze the following user skills:
{chr(10).join(skills_summary)}

Based on these skills, generate a JSON array of 3 to 5 career recommendations.

**IMPORTANT**: The output MUST be a valid JSON array. Each object in the array must strictly follow this structure:
{{
  "id": "string",
  "title": "string",
  "description": "string",
  "matchScore": "integer (a percentage from 0-100 representing how well the user's skills match this career)",
  "industry": "string",
  "salaryRange": "string (e.g., '₹6-25 LPA')",
  "growthRate": "string (e.g., '+25% YoY')",
  "locations": ["string"],
  "keySkills": ["string"],
  "requiredEducation": ["string"],
  "emergingTrends": ["string"],
  "topCompanies": ["string"],
  "workLifeBalance": "integer (a rating from 1-10)",
  "jobOpenings": "string (e.g., '12,500+')"
}}

Do not include any text, explanations, or markdown formatting before or after the JSON array. The entire response must be only the JSON data.
"""
    return prompt

def get_career_recommendations(skills):
    """
    Generates career recommendations using the Gemini model.
    """
    raw_response_text = ""
    try:
        model = genai.GenerativeModel('models/gemini-pro-latest')
        prompt = create_recommendation_prompt(skills)
        response = model.generate_content(prompt)
        raw_response_text = response.text
        cleaned_response = raw_response_text.strip().replace('```json', '').replace('```', '').strip()
        recommendations = json.loads(cleaned_response)
        return recommendations
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON from Gemini response: {e}")
        print(f"--- Raw Gemini Response ---\n{raw_response_text}\n---------------------------")
        return {"error": "The AI returned an invalid response format. Please try again."}
    except Exception as e:
        print(f"Error generating content from Gemini: {e}")
        return {"error": "Sorry, I am having trouble generating a response right now."}

def get_certifications(career_title, skills):
    """
    Generates certification recommendations with a retry mechanism.
    """
    skills_summary = ", ".join([skill['name'] for category in skills for skill in category['skills']])
    prompt = f"""The user has skills: {skills_summary}. They want to become a {career_title}. 
    First, identify the top 3 most important skills they are missing for this role.
    Then, for each of those 3 missing skills, recommend one specific, highly-rated certification or course.
    Your response MUST be a single string containing a numbered list. Each item must have the course name followed by the full URL in parentheses.
    **CRITICAL INSTRUCTION**: The URL must be a full, direct, and working deep link to the course landing page. Do NOT provide partial links, broken links, or links to a general homepage.
    Example:
    1. Google Data Analytics Professional Certificate (https://www.coursera.org/professional-certificates/google-data-analytics)
    """
    retries = 3
    for i in range(retries):
        try:
            model = genai.GenerativeModel('models/gemini-pro-latest')
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            if "503" in str(e) and i < retries - 1:
                print(f"Model overloaded, retrying in 2 seconds... (Attempt {i+1}/{retries})")
                time.sleep(2)
            else:
                print(f"Error fetching certifications: {e}")
                return {"error": f"Failed to fetch certifications: {e}"}
    return {"error": "The model is currently overloaded. Please try again later."}

def get_job_listings(role, location):
    """
    Generates job search URLs for major job portals.
    """
    prompt = f"""You are an expert job search assistant. Your task is to generate job search URLs for popular Indian job portals.

    Generate 3 search URLs for a '{role}' position in '{location}, India'.

    Create a numbered list for the following portals:
    1.  LinkedIn
    2.  Naukri.com
    3.  Indeed

    For each portal, construct a direct search URL for the specified role and location. The output should be a numbered list where each item has the name of the search and the full URL in parentheses.

    Example for "Software Engineer" in "Bangalore":
    1. Search on LinkedIn (https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=Bangalore%2C%20Karnataka%2C%20India)
    2. Search on Naukri.com (https://www.naukri.com/software-engineer-jobs-in-bangalore)
    3. Search on Indeed (https://in.indeed.com/jobs?q=Software+Engineer&l=Bangalore)
    """
    try:
        model = genai.GenerativeModel('models/gemini-pro-latest')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error fetching job listings: {e}")
        return {"error": f"Failed to fetch job listings: {e}"}

from resume_builder_logic import generate_summary_from_experience, generate_resume_html
import pdfkit

def get_interview_questions(role):
    """
    Generates interview questions and answers for a given role.
    """
    prompt = f"""You are an expert interview coach. Your task is to generate 10 common interview questions for a '{role}' position in India, along with detailed answers for each.

    The output MUST be a valid JSON object with two keys: "questions" and "answers".
    -   "questions": An array of 10 question strings.
    -   "answers": An array of 10 detailed answer strings corresponding to the questions.

    Example for "Software Engineer":
    {{
        "questions": [
            "Tell me about yourself.",
            "What are your strengths and weaknesses?",
            "Explain a challenging project you worked on.",
            "... (and 7 more questions) ..."
        ],
        "answers": [
            "I am a software engineer with 3 years of experience...",
            "My greatest strength is my problem-solving ability... My main weakness is that I can be too self-critical...",
            "In my previous role, I was tasked with...",
            "... (and 7 more detailed answers) ..."
        ]
    }}

    Do not include any text, explanations, or markdown formatting before or after the JSON object. The entire response must be only the JSON data.
    """
    try:
        model = genai.GenerativeModel('models/gemini-pro-latest')
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace('```json', '').replace('```', '').strip()
        return json.loads(cleaned_response)
    except Exception as e:
        print(f"Error fetching interview questions: {e}")
        return {"error": f"Failed to fetch interview questions: {e}"}

def get_career_advice(question):
    """
    Provides career advice based on a question using the Gemini model.
    """
    try:
        model = genai.GenerativeModel('models/gemini-pro-latest')
        prompt = f"You are a helpful and knowledgeable career advisor. The user's question is: {question}. Provide a helpful and concise response."
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating content: {e}")
        return "Sorry, I am having trouble generating a response right now."

def get_interview_summary(role):
    """
    Generates interview summary with tips.
    """
    prompt = f"""You are an expert career coach. Your task is to generate a summary for a user who has just completed a mock interview for a '{role}' position.

    The output MUST be a valid JSON object with one key: "tips".
    -   "tips": A string containing a few bullet points with actionable tips to clear the interview for that role.

    Example for "Software Engineer":
    {{
        "tips": "- Practice data structures and algorithms.\n- Be prepared to discuss your past projects in detail.\n- Research the company and the specific role you are applying for."
    }}

    Do not include any text, explanations, or markdown formatting before or after the JSON object. The entire response must be only the JSON data.
    """
    try:
        model = genai.GenerativeModel('models/gemini-pro-latest')
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace('```json', '').replace('```', '').strip()
        summary = json.loads(cleaned_response)

        summary['videos'] = []
        summary['articles'] = []

        return summary
    except Exception as e:
        print(f"Error fetching interview summary: {e}")
        return {"error": f"Failed to fetch interview summary: {e}"}

# --- Flask App ---
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    target = os.path.join(STATIC_DIR, path)
    if path != "" and os.path.exists(target):
        return send_from_directory(STATIC_DIR, path)
    else:
        return send_from_directory(STATIC_DIR, "index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    bot_response = get_career_advice(user_message)
    return jsonify({"response": bot_response})

@app.route("/api/interview-summary", methods=["POST"])
def interview_summary():
    data = request.get_json()
    role = data.get("role")
    if not role:
        return jsonify({"error": "Role is required"}), 400
    response = get_interview_summary(role)
    if isinstance(response, dict) and "error" in response:
        return jsonify(response), 500
    return jsonify(response)

@app.route("/api/recommendations", methods=["POST"])
def recommendations():
    data = request.get_json()
    skills = data.get("skills")
    if not skills:
        return jsonify({"error": "No skills data provided"}), 400
    bot_response = get_career_recommendations(skills)
    if isinstance(bot_response, dict) and "error" in bot_response:
        return jsonify(bot_response), 500
    return jsonify(bot_response)

@app.route("/api/certifications", methods=["POST"])
def certifications():
    data = request.get_json()
    career_title = data.get("career_title")
    skills = data.get("skills", [])  # Default to an empty list if not provided
    if not career_title:
        return jsonify({"error": "Career title is required"}), 400
    response = get_certifications(career_title, skills)
    if isinstance(response, dict) and "error" in response:
        return jsonify(response), 500
    return jsonify({"certifications": response})

@app.route("/api/job-listings", methods=["POST"])
def job_listings():
    data = request.get_json()
    role = data.get("role")
    location = data.get("location")
    if not role or not location:
        return jsonify({"error": "Role and location are required"}), 400
    response = get_job_listings(role, location)
    if isinstance(response, dict) and "error" in response:
        return jsonify(response), 500
    return jsonify({"job_listings": response})

@app.route("/api/interview-questions", methods=["POST"])
def interview_questions():
    data = request.get_json()
    role = data.get("role")
    if not role:
        return jsonify({"error": "Role is required"}), 400
    response = get_interview_questions(role)
    if isinstance(response, dict) and "error" in response:
        return jsonify(response), 500
    return jsonify(response)

@app.route("/api/resume-builder", methods=["POST"])
def resume_builder():
    data = request.get_json()
    step = data.get("step")

    if step == "summary":
        work_experience_text = data.get("work_experience_text", "")
        summary = generate_summary_from_experience(work_experience_text)
        return jsonify({"summary": summary})

    if step == "generate-html":
        try:
            resume_data = data.get("resume_data", {})
            html_resume = generate_resume_html(resume_data)
            return jsonify({"html": html_resume})
        except Exception as e:
            print(f"[Resume Builder HTML Error] {e}")
            return jsonify({"error": f"HTML Generation Failed: {e}"}), 500

    if step == "generate-pdf":
        resume_data = data.get("resume_data", {})
        html_resume = generate_resume_html(resume_data)
        try:
            # Path to wkhtmltopdf executable
            path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
            config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)
            options = {
                'quiet': ''
            }
            pdf = pdfkit.from_string(html_resume, False, configuration=config, options=options)
            response = make_response(pdf)
            response.headers['Content-Type'] = 'application/pdf'
            response.headers['Content-Disposition'] = 'attachment; filename=resume.pdf'
            return response
        except Exception as e:
            # Log the error, especially stderr from wkhtmltopdf
            error_message = str(e)
            if "No wkhtmltopdf executable found" in error_message:
                error_message = "wkhtmltopdf not found. Please ensure it is installed and in your system's PATH."
            print(f"[Resume Builder Error] {error_message}")
            return jsonify({"error": f"PDF Generation Failed: {error_message}"}), 500

    return jsonify({"error": "Invalid step"}), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)

@app.route('/api/test')
def test():
    return jsonify({'message': 'API working'})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    # Point to React build folder
    react_build = os.path.join(os.path.dirname(__file__), '../frontend/build')
    
    if path != "" and os.path.exists(os.path.join(react_build, path)):
        return send_from_directory(react_build, path)
    else:
        return send_from_directory(react_build, 'index.html')