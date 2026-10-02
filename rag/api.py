from pathlib import Path

from fastapi import FastAPI
from pydantic import BaseModel

import chromadb
from sentence_transformers import SentenceTransformer


# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------

RAG_DIR = Path(__file__).parent
CHROMA_DIR = RAG_DIR / "chroma_db"
COLLECTION_NAME = "qa_knowledge"


# ---------------------------------------------------------
# Initialize RAG components
# ---------------------------------------------------------

print("Loading embedding model...")

model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(
    path=str(CHROMA_DIR)
)

collection = client.get_or_create_collection(
    name=COLLECTION_NAME
)


# ---------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------

app = FastAPI(
    title="AI E2E QA RAG API",
    description="RAG retrieval API for the AI-Powered E2E QA Automation Agent",
    version="1.0.0"
)


# ---------------------------------------------------------
# Request model
# ---------------------------------------------------------

class RetrievalRequest(BaseModel):
    query: str
    top_k: int = 4


# ---------------------------------------------------------
# Health check
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "status": "running",
        "service": "AI E2E QA RAG API"
    }


# ---------------------------------------------------------
# RAG retrieval endpoint
# ---------------------------------------------------------

@app.post("/retrieve")
def retrieve(request: RetrievalRequest):

    query = request.query.strip()

    if not query:
        return {
            "query": query,
            "results": []
        }

    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=request.top_k
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    retrieved_context = []

    for document, metadata in zip(documents, metadatas):

        retrieved_context.append(
            {
                "source": metadata.get("source", "unknown"),
                "content": document
            }
        )

    return {
        "query": query,
        "results": retrieved_context
    }