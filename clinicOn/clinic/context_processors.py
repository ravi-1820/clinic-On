def user_context(request):
    """
    Context processor to provide user_initials (first letter of first name + first letter of last name)
    across all templates in the Clinic On application.
    Example: 'Rajja panchal' -> 'RP'
    """
    name = request.session.get('name', '')
    initials = ""
    if name:
        parts = [p for p in str(name).strip().split() if p]
        filtered = [p for p in parts if p.lower().rstrip('.') not in {'dr', 'mr', 'mrs', 'ms', 'prof'}]
        if not filtered:
            filtered = parts
        if len(filtered) >= 2:
            initials = (filtered[0][0] + filtered[-1][0]).upper()
        elif len(filtered) == 1:
            initials = filtered[0][0].upper()
    return {
        'user_initials': initials or "U"
    }
