from __future__ import annotations

from jira import JIRA
import os
from dotenv import load_dotenv
from models.ticket import JiraTicketData, JiraRequest

load_dotenv(".env.local")


def save_jira_issues(
    requests: list[JiraRequest],
) -> list[JiraTicketData]:
    """
    Save Jira issues (task, bug, story) with the given parameters. 

    Args:
        requests: List of Jira requests
    Returns:
        list[JiraTicketData]: Created issues
    """
    project = "SIMPLAIX"
    server = os.getenv("JIRA_BASE_URL")
    auth_token = os.getenv("JIRA_API_TOKEN")
    username = os.getenv("JIRA_USERNAME")
    # Initialize Jira client with token authentication
    jira = JIRA(server=server,
                basic_auth=(username, auth_token))

    # Create the issue
    new_issues = []
    for request in requests:
        new_issue = jira.create_issue(
            project=project,
            summary=request.summary,
            description=request.description,
            issuetype={"name": request.type.value},
        )
        new_issues.append(
            JiraTicketData(
                id=new_issue.key,
                title=request.summary,
                description=request.description,
                type=request.type,
            )
        )
    return new_issues
