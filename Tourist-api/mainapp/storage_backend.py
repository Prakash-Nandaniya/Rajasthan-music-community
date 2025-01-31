from storages.backends.s3boto3 import S3Boto3Storage
import environ
env = environ.Env()
environ.Env.read_env()  

class MainImageStorage(S3Boto3Storage):
    bucket_name = env('MAIN_IMAGE_BUCKET', default='default_bucket_name')
    custom_domain = f'{bucket_name}.s3.amazonaws.com'

class MoreImagesStorage(S3Boto3Storage):
    bucket_name = env('MORE_IMAGES_BUCKET', default='default_bucket_name')
    custom_domain = f'{bucket_name}.s3.amazonaws.com'
    
class VideosStorage(S3Boto3Storage):
    bucket_name = env('VIDEOS_BUCKET', default='default_bucket_name')
    custom_domain = f'{bucket_name}.s3.amazonaws.com'
