from storages.backends.s3boto3 import S3Boto3Storage
import environ

env = environ.Env()
environ.Env.read_env()  

class MainImageStorage(S3Boto3Storage):
    bucket_name = env('MAIN_IMAGE_BUCKET', default='default_bucket_name')
    custom_domain = f's3.{env("AWS_S3_REGION_NAME")}.amazonaws.com/{bucket_name}'  # Added region and bucket to the URL

class MoreImagesStorage(S3Boto3Storage):
    bucket_name = env('MORE_IMAGES_BUCKET', default='default_bucket_name')
    custom_domain = f's3.{env("AWS_S3_REGION_NAME")}.amazonaws.com/{bucket_name}'  # Same here for region

class VideosStorage(S3Boto3Storage):
    bucket_name = env('VIDEOS_BUCKET', default='default_bucket_name')
    custom_domain = f's3.{env("AWS_S3_REGION_NAME")}.amazonaws.com/{bucket_name}'  # Same here for region
