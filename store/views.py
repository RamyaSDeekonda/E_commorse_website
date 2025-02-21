from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Product, Wishlist, Cart

def index(request):
    products = Product.objects.all()
    return render(request, 'store/index.html', {'products': products})

@login_required
def add_to_wishlist(request, product_id):
    if request.method == 'POST':
        product = Product.objects.get(id=product_id)
        wishlist, created = Wishlist.objects.get_or_create(
            user=request.user,
            product=product
        )
        return JsonResponse({'status': 'success'})

@login_required
def remove_from_wishlist(request, product_id):
    if request.method == 'POST':
        Wishlist.objects.filter(
            user=request.user,
            product_id=product_id
        ).delete()
        return JsonResponse({'status': 'success'})

@login_required
def add_to_cart(request, product_id):
    if request.method == 'POST':
        product = Product.objects.get(id=product_id)
        cart, created = Cart.objects.get_or_create(
            user=request.user,
            product=product
        )
        if not created:
            cart.quantity += 1
            cart.save()
        return JsonResponse({'status': 'success'})

@login_required
def update_cart(request, product_id):
    if request.method == 'POST':
        quantity = int(request.POST.get('quantity'))
        cart = Cart.objects.get(
            user=request.user,
            product_id=product_id
        )
        if quantity > 0:
            cart.quantity = quantity
            cart.save()
        else:
            cart.delete()
        return JsonResponse({'status': 'success'})

@login_required
def payment(request):
    cart_items = Cart.objects.filter(user=request.user)
    total = sum(item.product.price * item.quantity for item in cart_items)
    return render(request, 'store/payment.html', {
        'cart_items': cart_items,
        'total': total
    }) 