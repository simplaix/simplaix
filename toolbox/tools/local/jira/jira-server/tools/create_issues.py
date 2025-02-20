from models.ticket import JiraTicketData, JiraRequest


def create_jira_issues(
    requests: list[JiraRequest],
) -> list[JiraTicketData]:
    """
    Create Jira issues on UI (task, bug, story) with the given parameters.

    Args:
        requests: List of Jira requests
    Returns:
        list[JiraTicketData]: Created issues
    """
    # Create the issue
    # new_issues = []
    # for request in requests:
    #     new_issues.append(
    #         JiraTicketData(
    #             id=str(uuid.uuid4()),
    #             title=request.summary,
    #             description=request.description,
    #             type=request.type,
    #         )
    #     )
    # return new_issues
    pass