from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer


CHROMA_DIR = Path(__file__).parent / "chroma_db"

COLLECTION_NAME = "qa_knowledge"


model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

client = chromadb.PersistentClient(
    path=str(CHROMA_DIR)
)

collection = client.get_collection(
    name=COLLECTION_NAME
)


def retrieve_context(
    query,
    top_k=4
):

    query_embedding = model.encode(
        query
    ).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

    documents = results["documents"][0]

    metadatas = results["metadatas"][0]

    context = []

    for document, metadata in zip(
        documents,
        metadatas
    ):

        context.append(
            {
                "source": metadata["source"],
                "content": document,
            }
        )

    return context


if __name__ == "__main__":

    query = input(
        "Enter your QA question: "
    )

    results = retrieve_context(query)

    print("\nRetrieved QA Knowledge:\n")

    for index, result in enumerate(
        results,
        start=1
    ):

        print(
            f"--- Result {index} ---"
        )

        print(
            f"Source: {result['source']}"
        )

        print(
            result["content"]
        )

        print()