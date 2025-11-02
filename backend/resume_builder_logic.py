import re
from transformers import T5Tokenizer, T5ForConditionalGeneration

def generate_summary_from_experience(work_experience):
    tokenizer = T5Tokenizer.from_pretrained("t5-small")
    model = T5ForConditionalGeneration.from_pretrained("t5-small")
    input_text = f"summarize: {work_experience}"
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(inputs.input_ids, max_length=150, min_length=30, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    # Split the summary into sentences and format it
    sentences = summary.split(". ")  # Split by period to separate sentences
    formatted_summary = "I worked as " + ". \n".join(sentences)  # Join sentences with newlines
    return formatted_summary
def generate_resume_html(data):
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume - {data.get('name', '')}</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 800px; margin: 0 auto; padding: 20px; }}
            h1 {{ text-align: center; font-size: 36px; margin-bottom: 10px; color: #000; }}
            .contact-info {{ text-align: center; margin-bottom: 20px; }}
            .section {{ margin-bottom: 20px; }}
            .section h2 {{ font-size: 20px; color: #000; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px; font-weight: bold; }}
            .experience, .education, .project {{ margin-bottom: 15px; }}
            .experience h3, .education h3, .project h3 {{ margin: 0; font-size: 18px; }}
            .experience p, .education p, .project p {{ margin: 5px 0; }}
            .skills, .certifications, .languages, .hobbies {{ margin-bottom: 10px; }}
            ul {{ padding-left: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>{data.get('name', '')}</h1>
            <div class="contact-info">
                <span>Phone: {data.get('phone', '')}</span> | 
                <span>Email: {data.get('email', '')}</span> | 
                <span>LinkedIn: {data.get('linkedin', 'N/A')}</span> | 
                <span>Portfolio: {data.get('portfolio', 'N/A')}</span> | 
                <span>Address: {data.get('address', 'N/A')}</span>
            </div>

            <div class="section">
                <h2>Professional Summary</h2>
                <p>{data.get('summary', '')}</p>
            </div>

            <div class="section">
                <h2>Work Experience</h2>
    """
    experiences = data.get('experiences', [])
    if isinstance(experiences, list):
        for exp in experiences:
            if isinstance(exp, dict):
                html += f"""
                    <div class="experience">
                        <h3>{exp.get('job_title', '')} | {exp.get('company', '')} | {exp.get('location', '')} | {exp.get('start_date', '')} - {exp.get('end_date', '')}</h3>
                        <ul>
                            {' '.join([f'<li>{ach}</li>' for ach in exp.get('achievements', [])])}
                        </ul>
                    </div>
                """

    html += """
            </div>

            <div class="section">
                <h2>Education</h2>
    """
    education = data.get('education', [])
    if isinstance(education, list):
        for edu in education:
            if isinstance(edu, dict):
                html += f"""
                    <div class="education">
                        <h3>{edu.get('degree', '')}</h3>
                        <p>{edu.get('institution', '')} | {edu.get('location', '')} | Graduated: {edu.get('graduation_date', '')}</p>
                        <p>Honors/Awards: {edu.get('honors', 'N/A')}</p>
                    </div>
                """

    html += f"""
            </div>

            <div class="section">
                <h2>Skills</h2>
                <p>{', '.join(data.get('skills', [])) if isinstance(data.get('skills'), list) else ''}</p>
            </div>

            <div class="section">
                <h2>Certifications</h2>
                <p>{', '.join(data.get('certifications', [])) if data.get('certifications') and isinstance(data.get('certifications'), list) else "N/A"}</p>
            </div>

            <div class="section">
                <h2>Projects</h2>
    """
    projects = data.get('projects', [])
    if isinstance(projects, list):
        for proj in projects:
            if isinstance(proj, dict):
                html += f"""
                    <div class="project">
                        <h3>{proj.get('title', '')}</h3>
                        <p><strong>Description:</strong> {proj.get('description', '')}</p>
                        <p><strong>Technologies:</strong> {proj.get('technologies', '')}</p>
                        <p><strong>Role:</strong> {proj.get('role', '')}</p>
                    </div>
                """

    html += f"""
            </div>

            <div class="section">
                <h2>Languages</h2>
                <p>{', '.join(data.get('languages', [])) if data.get('languages') and isinstance(data.get('languages'), list) else "N/A"}</p>
            </div>

            <div class="section">
                <h2>Hobbies and Interests</h2>
                <p>{', '.join(data.get('hobbies', [])) if data.get('hobbies') and isinstance(data.get('hobbies'), list) else "N/A"}</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html
