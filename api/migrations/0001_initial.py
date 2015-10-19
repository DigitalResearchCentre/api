# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import api.models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('action', models.CharField(max_length=255, db_index=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('data', jsonfield.fields.JSONField(null=True, blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('key', models.CharField(max_length=36, db_index=True)),
            ],
            options={
                'ordering': ('-modified',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Attr',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=63)),
                ('value', models.CharField(max_length=255, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Community',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=20)),
                ('abbr', models.CharField(unique=True, max_length=4, verbose_name=b'abbreviation')),
                ('long_name', models.CharField(max_length=80, blank=True)),
                ('description', models.TextField(blank=True)),
                ('font', models.CharField(max_length=255, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CommunityMapping',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mapping_id', models.IntegerField()),
                ('community', models.OneToOneField(to='api.Community')),
            ],
            options={
                'db_table': 'community_communitymapping',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CSS',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('css', models.FileField(upload_to=api.models.css_upload_to, verbose_name=b'CSS')),
                ('community', models.ForeignKey(to='api.Community')),
            ],
            options={
                'db_table': 'det_css',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Doc',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lft', models.PositiveIntegerField(db_index=True)),
                ('rgt', models.PositiveIntegerField(db_index=True)),
                ('tree_id', models.PositiveIntegerField(db_index=True)),
                ('depth', models.PositiveIntegerField(db_index=True)),
                ('name', models.CharField(max_length=63)),
                ('label', models.CharField(max_length=63)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Entity',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lft', models.PositiveIntegerField(db_index=True)),
                ('rgt', models.PositiveIntegerField(db_index=True)),
                ('tree_id', models.PositiveIntegerField(db_index=True)),
                ('depth', models.PositiveIntegerField(db_index=True)),
                ('name', models.CharField(max_length=63)),
                ('label', models.CharField(max_length=63)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Header',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('xml', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email_content', models.TextField(blank=True)),
                ('code', models.CharField(max_length=32, db_index=True)),
                ('invited_date', models.DateTimeField(auto_now_add=True)),
                ('accepted_date', models.DateTimeField(null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='JS',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('js', models.FileField(upload_to=api.models.js_upload_to, verbose_name=b'Javascript')),
                ('community', models.ForeignKey(to='api.Community')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Membership',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('create_date', models.DateField(auto_now=True)),
                ('community', models.ForeignKey(to='api.Community')),
                ('role', models.ForeignKey(to='auth.Group')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Partner',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=80, db_index=True)),
                ('sso_url', models.URLField()),
            ],
            options={
                'db_table': 'community_partner',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='RefsDecl',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('description', models.TextField(blank=True)),
                ('type', models.IntegerField(default=2, choices=[(0, b'document'), (1, b'entity'), (2, b'text')])),
                ('xml', models.TextField()),
                ('template', models.TextField(blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Revision',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.IntegerField(default=0, choices=[(0, b'assigned'), (1, b'in_progress'), (2, b'submitted'), (3, b'committed'), (4, b'previous_db')])),
                ('create_date', models.DateTimeField(auto_now_add=True)),
                ('commit_date', models.DateTimeField(null=True, blank=True)),
                ('text', models.TextField(blank=True)),
                ('spent_time', models.IntegerField(default=0)),
                ('doc', models.ForeignKey(to='api.Doc')),
                ('prev', models.ForeignKey(related_name='next', blank=True, to='api.Revision', null=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-create_date'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Schema',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('schema', models.FileField(upload_to=api.models.schema_upload_to)),
                ('community', models.ForeignKey(to='api.Community')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.IntegerField(default=0, choices=[(0, b'assigned'), (1, b'in_progress'), (2, b'submitted'), (3, b'completed')])),
                ('doc', models.ForeignKey(editable=False, to='api.Doc')),
                ('membership', models.ForeignKey(to='api.Membership')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Text',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lft', models.PositiveIntegerField(db_index=True)),
                ('rgt', models.PositiveIntegerField(db_index=True)),
                ('tree_id', models.PositiveIntegerField(db_index=True)),
                ('depth', models.PositiveIntegerField(db_index=True)),
                ('tag', models.CharField(max_length=15)),
                ('text', models.TextField(blank=True)),
                ('tail', models.TextField(blank=True)),
                ('doc', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to='api.Doc')),
                ('entity', models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to='api.Entity', null=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Tile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('zoom', models.IntegerField()),
                ('x', models.IntegerField()),
                ('y', models.IntegerField()),
                ('blob_base64', api.models.Base64Field(db_column=b'blob')),
            ],
            options={
                'db_table': 'det_tile',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TilerImage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image', models.ImageField(height_field=b'height', width_field=b'width', upload_to=api.models.get_path)),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('doc', models.OneToOneField(to='api.Doc')),
            ],
            options={
                'db_table': 'det_tilerimage',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserMapping',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mapping_id', models.IntegerField()),
                ('partner', models.ForeignKey(to='api.Partner')),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'community_usermapping',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='tile',
            name='image',
            field=models.ForeignKey(to='api.TilerImage'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='tile',
            unique_together=set([('image', 'zoom', 'x', 'y')]),
        ),
        migrations.AlterUniqueTogether(
            name='task',
            unique_together=set([('doc', 'membership')]),
        ),
        migrations.AlterUniqueTogether(
            name='schema',
            unique_together=set([('community', 'schema')]),
        ),
        migrations.AddField(
            model_name='refsdecl',
            name='text',
            field=models.ForeignKey(blank=True, to='api.Text', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='invitation',
            name='invitee',
            field=models.OneToOneField(to='api.Membership'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='invitation',
            name='invitor',
            field=models.ForeignKey(related_name='+', to='api.Membership'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='header',
            name='text',
            field=models.ForeignKey(to='api.Text'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='doc',
            name='cur_rev',
            field=models.OneToOneField(related_name='+', null=True, blank=True, to='api.Revision'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='communitymapping',
            name='partner',
            field=models.ForeignKey(to='api.Partner'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='community',
            name='docs',
            field=models.ManyToManyField(to='api.Doc', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='community',
            name='entities',
            field=models.ManyToManyField(to='api.Entity', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='community',
            name='members',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL, through='api.Membership'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='community',
            name='refsdecls',
            field=models.ManyToManyField(to='api.RefsDecl', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='attr',
            name='text',
            field=models.ForeignKey(to='api.Text'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='attr',
            unique_together=set([('text', 'name')]),
        ),
        migrations.AddField(
            model_name='action',
            name='community',
            field=models.ForeignKey(to='api.Community'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='action',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.CreateModel(
            name='APIUser',
            fields=[
            ],
            options={
                'proxy': True,
            },
            bases=('auth.user',),
        ),
    ]
