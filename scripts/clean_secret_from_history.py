import os

path = ".github/workflows/autonomous_247_cloud_engine.yml"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    dirty = False
    secret_key = os.environ.get("BREVO_API_KEY", "")
    if secret_key and secret_key in content:
        content = content.replace(secret_key, "")
        dirty = True
        
    if "Bethelmind@2026" in content:
        content = content.replace("Bethelmind@2026", "")
        dirty = True
        
    if dirty:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
