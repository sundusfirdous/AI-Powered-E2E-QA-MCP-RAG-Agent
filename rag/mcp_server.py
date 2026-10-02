from pathlib import Path
import sys

import chromadb
from sentence_transformers import SentenceTransformer
from mcp.server.fastmcp import FastMCP


# =========================================================
# Configuration
# =========================================================

RAG_DIR = Path(__file__).resolve().parent
CHROMA_DIR = RAG_DIR / "chroma_db"
COLLECTION_NAME = "qa_knowledge"


# =========================================================
# Initialize Embedding Model
# =========================================================

print(
    "Loading RAG embedding model...",
    file=sys.stderr,
    flush=True,
)

model = SentenceTransformer("all-MiniLM-L6-v2")


# =========================================================
# Initialize ChromaDB
# =========================================================

client = chromadb.PersistentClient(
    path=str(CHROMA_DIR)
)

collection = client.get_or_create_collection(
    name=COLLECTION_NAME
)


# =========================================================
# Create MCP Server
# =========================================================

mcp = FastMCP("qa-rag-server")


# =========================================================
# RAG Retrieval Tool
# =========================================================

@mcp.tool()
def retrieve_qa_context(
    query: str,
    top_k: int = 4,
) -> str:
    """
    Retrieve relevant QA knowledge from the RAG knowledge base.

    Use this tool when planning, generating, reviewing,
    or debugging E2E tests.

    The knowledge base contains:
    - QA requirements
    - Existing test cases
    - Known defects
    - QA testing guidelines
    """

    query = query.strip()

    if not query:
        return "No query was provided."

    # Keep top_k within a safe range.
    top_k = max(1, min(top_k, 10))

    # Check whether the knowledge base contains documents.
    collection_count = collection.count()

    if collection_count == 0:
        return "The QA knowledge base is empty. Run rag/ingest.py first."

    # ChromaDB cannot request more results than available documents.
    top_k = min(top_k, collection_count)

    # Create embedding for the user's query.
    query_embedding = model.encode(
        query
    ).tolist()

    # Retrieve the most relevant documents.
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

    documents = results.get(
        "documents",
        [[]],
    )[0]

    metadatas = results.get(
        "metadatas",
        [[]],
    )[0]

    if not documents:
        return "No relevant QA knowledge was found."

    output = [
        "RAG retrieval completed successfully.",
        f"Query: {query}",
        f"Retrieved results: {len(documents)}",
        "",
    ]

    for index, (document, metadata) in enumerate(
        zip(documents, metadatas),
        start=1,
    ):
        source = metadata.get(
            "source",
            "unknown",
        )

        output.append(
            f"--- Retrieved QA Context {index} ---\n"
            f"Source: {source}\n"
            f"{document}"
        )

    return "\n\n".join(output)


# =========================================================
# Start MCP Server
# =========================================================

if __name__ == "__main__":
    mcp.run()