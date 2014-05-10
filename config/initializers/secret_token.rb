# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
BreweryLocator::Application.config.secret_key_base = ENV['SECRET_KEY_BASE'] || 'fb092fe88a2a6252befbb836c59b7e64dff0a3b2e6c23210f3a6174e023e9c09a83e345e133e9447f7801b78b0fb2b40059abd8770a106406cb397581ef858e8'
