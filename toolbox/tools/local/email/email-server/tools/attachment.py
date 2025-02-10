from __future__ import annotations

import base64
import os
from typing import Dict, List, Optional

from .account import build_gmail_service, check_gmail_token_file

def download_attachments(
    message_ids: List[str],
    output_dir: Optional[str] = None
) -> Dict[str, List[Dict[str, str]]]:
    """Download attachments from specified emails.
    
    Args:
        message_ids: List of Gmail message IDs to get attachments from
        output_dir: Optional directory to save attachments to (default: current directory)
        
    Returns:
        Dict mapping message IDs to lists of attachment info dictionaries with:
        - filename: name of the attachment
        - path: local path where file was saved
        - mimeType: MIME type of the attachment
        - blob: base64-encoded attachment data
    """
    if not check_gmail_token_file():
        raise ValueError("No valid token file found. Please login to Gmail first.")
        
    if output_dir is None:
        output_dir = os.getcwd()
    os.makedirs(output_dir, exist_ok=True)

    gmail_service = build_gmail_service()
    results = {}

    for message_id in message_ids:
        message = (
            gmail_service.users()
            .messages()
            .get(userId="me", id=message_id, format="full")
            .execute()
        )
        
        attachments = []
        
        if "parts" in message["payload"]:
            parts = message["payload"]["parts"]
            for part in parts:
                if "filename" in part and part["filename"]:
                    # Get attachment
                    if "body" in part and "attachmentId" in part["body"]:
                        attachment = (
                            gmail_service.users()
                            .messages()
                            .attachments()
                            .get(
                                userId="me",
                                messageId=message_id,
                                id=part["body"]["attachmentId"],
                            )
                            .execute()
                        )
                        
                        file_data = base64.urlsafe_b64decode(
                            attachment["data"].encode("utf-8")
                        )
                        
                        filepath = os.path.join(output_dir, part["filename"])
                        with open(filepath, "wb") as f:
                            f.write(file_data)
                            
                        attachments.append({
                            "filename": part["filename"],
                            "path": filepath,
                            "mimeType": part["mimeType"],
                            "blob": attachment["data"]  # Original base64 data
                        })
                        
        results[message_id] = attachments

    return results
