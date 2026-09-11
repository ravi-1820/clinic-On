from django import template

register = template.Library()

@register.filter(name='initials')
def initials(name):
    """
    Filter to extract first letter of first name and first letter of last name.
    Example: 'Rajja panchal' -> 'RP'
    """
    if not name:
        return "U"
    parts = [p for p in str(name).strip().split() if p]
    if not parts:
        return "U"
    filtered = [p for p in parts if p.lower().rstrip('.') not in {'dr', 'mr', 'mrs', 'ms', 'prof'}]
    if not filtered:
        filtered = parts
    if len(filtered) >= 2:
        return (filtered[0][0] + filtered[-1][0]).upper()
    elif len(filtered) == 1:
        return filtered[0][0].upper()
    return "U"
