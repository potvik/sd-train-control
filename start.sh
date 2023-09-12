#!/bin/bash

COMFY_UI_INPUTS="/home/ubuntu/ComfyUI/input"
COMFY_UI_LORAS="/home/ubuntu/ComfyUI/models/loras"
KOHYA_SS_INPUTS="/home/ubuntu/kohya_ss/inputs"
KOHYA_SS_OUTPUTS="/home/ubuntu/kohya_ss/outputs"
KOHYA_SS_TRAIN_SCRIPT="/home/ubuntu/kohya_ss/train_network.py"
OUT="."

LORA_NAME=$1
BASE_MODEL=$2

echo Started train for Lora: $LORA_NAME

echo $$ > $OUT/$LORA_NAME.lock

rm -rf $KOHYA_SS_OUTPUTS/*
rm -rf $KOHYA_SS_INPUTS/*

mkdir $KOHYA_SS_INPUTS/100_$LORA_NAME/

cp $COMFY_UI_INPUTS/*$LORA_NAME* $KOHYA_SS_INPUTS/100_$LORA_NAME/

for f in $KOHYA_SS_INPUTS/100_$LORA_NAME/*; do
  printf "$LORA_NAME\n" > "${f%.*}.txt"
done

accelerate launch --num_cpu_threads_per_process=2 "$KOHYA_SS_TRAIN_SCRIPT" --enable_bucket --min_bucket_reso=256 --max_bucket_reso=2048 --pretrained_model_name_or_path="$BASE_MODEL" --train_data_dir="$KOHYA_SS_INPUTS" --resolution="512,512" --output_dir="$KOHYA_SS_OUTPUTS" --network_alpha="1" --save_model_as=safetensors --network_module=networks.lora --text_encoder_lr=5e-05 --unet_lr=0.0001 --network_dim=8 --output_name="$LORA_NAME" --lr_scheduler_num_cycles="1" --no_half_vae --learning_rate="0.0001" --lr_scheduler="cosine" --train_batch_size="1" --save_every_n_epochs="1" --mixed_precision="fp16" --save_precision="fp16" --cache_latents --optimizer_type="AdamW8bit" --max_data_loader_n_workers="0" --bucket_reso_steps=64 --xformers --bucket_no_upscale --noise_offset=0.0

#rm -rf $KOHYA_SS_INPUTS/*
cp $KOHYA_SS_OUTPUTS/$LORA_NAME.safetensors $COMFY_UI_LORAS/$LORA_NAME.safetensors

echo completed > $OUT/$LORA_NAME.lock