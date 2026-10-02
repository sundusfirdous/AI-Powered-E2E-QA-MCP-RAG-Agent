from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer


KNOWLEDGE_DIR = Path(__file__).parent / "knowledge"
CHROMA_DIR = Path(__file__).parent / "chroma_db"

COLLECTION_NAME = "qa_knowledge"


def load_documents():
    documents = []

    for file_path in KNOWLEDGE_DIR.glob("*.md"):
        content = file_path.read_text(encoding="utf-8")

        documents.append(
            {
                "file": file_path.name,
                "content": content,
            }
        )

    return documents


def chunk_text(text, chunk_size=800):
    words = text.split()

    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])

        if chunk.strip():
            chunks.append(chunk)

    return chunks


def main():
    print("Loading QA knowledge...")

    documents = load_documents()

    if not documents:
        print("No knowledge documents found.")
        return

    print(f"Found {len(documents)} documents.")

    model = SentenceTransformer(
        "all-MiniLM-L6-v2"
    )

    client = chromadb.PersistentClient(
        path=str(CHROMA_DIR)
    )

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME
    )

    document_id = 0

    for document in documents:

        chunks = chunk_text(
            document["content"]
        )

        for chunk in chunks:

            embedding = model.encode(
                chunk
            ).tolist()

            collection.upsert(
                ids=[f"doc_{document_id}"],
                documents=[chunk],
                embeddings=[embedding],
                metadatas=[
                    {
                        "source": document["file"]
                    }
                ],
            )

            document_id += 1

    print()
    print("RAG ingestion completed.")
    print(f"Indexed chunks: {document_id}")
    print(f"Database: {CHROMA_DIR}")


if __name__ == "__main__":
    main()