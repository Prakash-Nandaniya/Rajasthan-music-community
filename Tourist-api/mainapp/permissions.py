from rest_framework.permissions import BasePermission

class IsAuthenticated(BasePermission):
    """
    Allows access only to authenticated users or artists based on session.
    """
    def has_permission(self, request, view):
        return bool(request.session.get('is_authenticated', False))

class IsUser(BasePermission):
    """
    Allows access only to authenticated users with role 'user'.
    """
    def has_permission(self, request, view):
        return bool(
            request.session.get('is_authenticated', False) and
            request.session.get('role') == 'user'
        )

class IsArtist(BasePermission):
    """
    Allows access only to authenticated artists with role 'artist'.
    """
    def has_permission(self, request, view):
        return bool(
            request.session.get('is_authenticated', False) and
            request.session.get('role') == 'artist'
        )
        
class IsArtistForSite(BasePermission):
    """
    Allows access only to artists whose session site_id matches the requested pk.
    """
    def has_permission(self, request, view):
        # Check if user is an artist
        if not (request.session.get('is_authenticated', False) and request.session.get('role') == 'artist'):
            return False
        # Check if site_id in session matches the pk from the URL
        site_id = request.session.get('site_id')
        pk = view.kwargs.get('pk')  # Get pk from URL kwargs
        return site_id == int(pk) if site_id and pk else False